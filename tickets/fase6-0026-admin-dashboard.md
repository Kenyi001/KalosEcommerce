# Ticket Fase 6-0026: Panel de Administración

## 📋 Descripción
Implementar panel de administración completo para gestionar la plataforma Kalos, incluyendo analytics, gestión de usuarios, moderación de contenido, configuración del sistema y herramientas de soporte.

## 🎯 Objetivos
- Dashboard centralizado con métricas clave
- Gestión completa de usuarios y profesionales
- Herramientas de moderación y soporte
- Analytics de negocio y reportes
- Configuración de plataforma
- Sistema de auditoría y logs
- Herramientas de marketing

## 📊 Criterios de Aceptación

### ✅ Dashboard Principal
- [ ] Métricas clave en tiempo real (usuarios, reservas, ingresos)
- [ ] Gráficos de tendencias y analytics
- [ ] Alertas y notificaciones administrativas
- [ ] Accesos rápidos a funciones principales
- [ ] Filtros por fecha y segmentación

### ✅ Gestión de Usuarios
- [ ] Lista completa de usuarios con filtros
- [ ] Perfiles detallados con historial
- [ ] Herramientas de verificación y moderación
- [ ] Gestión de roles y permisos
- [ ] Estadísticas por usuario

### ✅ Analytics y Reportes
- [ ] Reportes de ventas y comisiones
- [ ] Analytics de comportamiento de usuarios
- [ ] Métricas de conversion y retención
- [ ] Exportación de datos
- [ ] Dashboards personalizables

### ✅ Herramientas de Moderación
- [ ] Cola de contenido por revisar
- [ ] Sistema de reportes y denuncias
- [ ] Herramientas de baneos y suspensiones
- [ ] Registro de acciones de moderación

## 🔧 Implementación Técnica

### Admin Panel Architecture
```
src/
├── admin/
│   ├── components/
│   │   ├── Dashboard/
│   │   │   ├── MetricsCards.js          # Tarjetas de métricas
│   │   │   ├── ChartsSection.js         # Gráficos y analytics
│   │   │   ├── ActivityFeed.js          # Feed de actividad
│   │   │   └── QuickActions.js          # Acciones rápidas
│   │   ├── Users/
│   │   │   ├── UsersList.js             # Lista de usuarios
│   │   │   ├── UserProfile.js           # Perfil detallado
│   │   │   ├── UserVerification.js      # Herramientas verificación
│   │   │   └── UserStats.js             # Estadísticas usuario
│   │   ├── Analytics/
│   │   │   ├── SalesReports.js          # Reportes de ventas
│   │   │   ├── UserAnalytics.js         # Analytics usuarios
│   │   │   ├── BookingAnalytics.js      # Analytics reservas
│   │   │   └── CustomReports.js         # Reportes personalizados
│   │   ├── Moderation/
│   │   │   ├── ContentQueue.js          # Cola de moderación
│   │   │   ├── ReportsManager.js        # Gestión reportes
│   │   │   ├── BanManager.js            # Gestión baneos
│   │   │   └── AuditLog.js              # Log de auditoría
│   │   └── Settings/
│   │       ├── PlatformConfig.js        # Configuración plataforma
│   │       ├── CommissionSettings.js    # Configuración comisiones
│   │       ├── NotificationSettings.js  # Config notificaciones
│   │       └── PaymentSettings.js       # Configuración pagos
│   ├── services/
│   │   ├── AdminService.js              # Servicio principal admin
│   │   ├── AnalyticsService.js          # Servicio analytics
│   │   ├── ModerationService.js         # Servicio moderación
│   │   └── ReportsService.js            # Servicio reportes
│   ├── pages/
│   │   ├── AdminDashboard.js            # Página principal
│   │   ├── UserManagement.js            # Gestión usuarios
│   │   ├── Analytics.js                 # Página analytics
│   │   ├── ModerationCenter.js          # Centro moderación
│   │   └── Settings.js                  # Configuraciones
│   └── utils/
│       ├── adminHelpers.js              # Utilidades admin
│       ├── chartHelpers.js              # Utilidades gráficos
│       └── exportHelpers.js             # Utilidades exportación
```

### AdminService Implementation
```javascript
// src/admin/services/AdminService.js
export class AdminService {
  static cache = new Map();
  static CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  /**
   * Obtener métricas del dashboard
   */
  static async getDashboardMetrics(period = 'week') {
    try {
      const cacheKey = `dashboard_metrics_${period}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case 'day':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      // Obtener métricas en paralelo
      const [
        totalUsers,
        newUsers,
        totalProfessionals,
        newProfessionals,
        totalBookings,
        newBookings,
        totalRevenue,
        newRevenue,
        activeUsers,
        conversionRate
      ] = await Promise.all([
        this.getTotalUsers(),
        this.getNewUsers(startDate, endDate),
        this.getTotalProfessionals(),
        this.getNewProfessionals(startDate, endDate),
        this.getTotalBookings(),
        this.getNewBookings(startDate, endDate),
        this.getTotalRevenue(),
        this.getNewRevenue(startDate, endDate),
        this.getActiveUsers(startDate, endDate),
        this.getConversionRate(startDate, endDate)
      ]);

      const metrics = {
        users: {
          total: totalUsers,
          new: newUsers,
          growth: this.calculateGrowth(totalUsers, newUsers, period)
        },
        professionals: {
          total: totalProfessionals,
          new: newProfessionals,
          growth: this.calculateGrowth(totalProfessionals, newProfessionals, period)
        },
        bookings: {
          total: totalBookings,
          new: newBookings,
          growth: this.calculateGrowth(totalBookings, newBookings, period)
        },
        revenue: {
          total: totalRevenue,
          new: newRevenue,
          growth: this.calculateGrowth(totalRevenue, newRevenue, period)
        },
        engagement: {
          activeUsers,
          conversionRate
        },
        period,
        generatedAt: Date.now()
      };

      // Guardar en cache
      this.cache.set(cacheKey, {
        data: metrics,
        timestamp: Date.now()
      });

      return metrics;

    } catch (error) {
      console.error('Error getting dashboard metrics:', error);
      return {};
    }
  }

  /**
   * Obtener analytics de usuarios
   */
  static async getUserAnalytics(period = 'month', filters = {}) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - (period === 'month' ? 1 : 3));

      let query = db.collection('users');
      
      // Aplicar filtros
      if (filters.userType) {
        query = query.where('type', '==', filters.userType);
      }
      
      if (filters.verified !== undefined) {
        query = query.where('verified', '==', filters.verified);
      }
      
      if (filters.city) {
        query = query.where('city', '==', filters.city);
      }

      const snapshot = await query.get();
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Analizar datos
      const analytics = {
        totalUsers: users.length,
        usersByType: this.groupBy(users, 'type'),
        usersByCity: this.groupBy(users, 'city'),
        verifiedUsers: users.filter(u => u.verified).length,
        usersByMonth: this.groupUsersByMonth(users, startDate, endDate),
        topCities: this.getTopCities(users),
        avgRating: this.calculateAverageRating(users.filter(u => u.type === 'professional')),
        retentionRate: await this.calculateRetentionRate(users, period)
      };

      return analytics;

    } catch (error) {
      console.error('Error getting user analytics:', error);
      return {};
    }
  }

  /**
   * Obtener analytics de reservas
   */
  static async getBookingAnalytics(period = 'month') {
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case 'week':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(endDate.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(endDate.getMonth() - 3);
          break;
      }

      const bookings = await db.collection('bookings')
        .where('createdAt', '>=', startDate.getTime())
        .where('createdAt', '<=', endDate.getTime())
        .get();

      const bookingData = bookings.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const analytics = {
        totalBookings: bookingData.length,
        bookingsByStatus: this.groupBy(bookingData, 'status'),
        bookingsByService: this.groupBy(bookingData, 'service.category'),
        averageBookingValue: this.calculateAverageValue(bookingData),
        bookingsByDay: this.groupBookingsByDay(bookingData),
        topProfessionals: await this.getTopProfessionals(bookingData),
        cancellationRate: this.calculateCancellationRate(bookingData),
        revenue: {
          total: this.calculateTotalRevenue(bookingData),
          byService: this.calculateRevenueByService(bookingData),
          commission: this.calculateCommissionRevenue(bookingData)
        }
      };

      return analytics;

    } catch (error) {
      console.error('Error getting booking analytics:', error);
      return {};
    }
  }

  /**
   * Obtener reportes financieros
   */
  static async getFinancialReports(period = 'month') {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(endDate.getMonth() - 1);

      // Obtener transacciones
      const transactions = await db.collection('transactions')
        .where('createdAt', '>=', startDate.getTime())
        .where('createdAt', '<=', endDate.getTime())
        .orderBy('createdAt', 'desc')
        .get();

      const transactionData = transactions.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calcular métricas financieras
      const reports = {
        totalRevenue: transactionData
          .filter(t => t.type === 'payment' && t.status === 'completed')
          .reduce((sum, t) => sum + t.amount, 0),
        
        totalCommission: transactionData
          .filter(t => t.type === 'commission' && t.status === 'completed')
          .reduce((sum, t) => sum + t.amount, 0),
        
        totalRefunds: transactionData
          .filter(t => t.type === 'refund' && t.status === 'completed')
          .reduce((sum, t) => sum + t.amount, 0),
        
        transactionsByType: this.groupBy(transactionData, 'type'),
        transactionsByStatus: this.groupBy(transactionData, 'status'),
        paymentMethods: this.groupBy(transactionData, 'paymentMethod'),
        
        revenueByDay: this.groupRevenueByDay(transactionData),
        topEarningProfessionals: await this.getTopEarningProfessionals(transactionData),
        
        averageTransactionValue: transactionData.length > 0 
          ? transactionData.reduce((sum, t) => sum + t.amount, 0) / transactionData.length 
          : 0,
        
        period: {
          start: startDate.toISOString(),
          end: endDate.toISOString()
        }
      };

      return reports;

    } catch (error) {
      console.error('Error getting financial reports:', error);
      return {};
    }
  }

  /**
   * Gestionar usuario (verificar, suspender, etc.)
   */
  static async manageUser(userId, action, data = {}) {
    try {
      const userRef = db.collection('users').doc(userId);
      const user = await userRef.get();
      
      if (!user.exists) {
        throw new Error('Usuario no encontrado');
      }

      const userData = user.data();
      const adminAction = {
        action,
        adminId: data.adminId,
        reason: data.reason || '',
        timestamp: Date.now(),
        previousState: userData.status || 'active'
      };

      let updateData = {
        updatedAt: Date.now()
      };

      switch (action) {
        case 'verify':
          updateData.verified = true;
          updateData.verifiedAt = Date.now();
          updateData.verifiedBy = data.adminId;
          break;
          
        case 'unverify':
          updateData.verified = false;
          updateData.verifiedAt = null;
          updateData.verifiedBy = null;
          break;
          
        case 'suspend':
          updateData.status = 'suspended';
          updateData.suspendedAt = Date.now();
          updateData.suspendedBy = data.adminId;
          updateData.suspensionReason = data.reason;
          break;
          
        case 'unsuspend':
          updateData.status = 'active';
          updateData.suspendedAt = null;
          updateData.suspendedBy = null;
          updateData.suspensionReason = null;
          break;
          
        case 'ban':
          updateData.status = 'banned';
          updateData.bannedAt = Date.now();
          updateData.bannedBy = data.adminId;
          updateData.banReason = data.reason;
          break;
          
        case 'unban':
          updateData.status = 'active';
          updateData.bannedAt = null;
          updateData.bannedBy = null;
          updateData.banReason = null;
          break;
          
        default:
          throw new Error('Acción no válida');
      }

      // Actualizar usuario
      await userRef.update(updateData);

      // Registrar acción en log de auditoría
      await this.logAdminAction(userId, adminAction);

      // Enviar notificación al usuario si corresponde
      if (['suspend', 'ban', 'verify'].includes(action)) {
        await this.notifyUserOfAdminAction(userId, action, data.reason);
      }

      return {
        success: true,
        action: adminAction
      };

    } catch (error) {
      console.error('Error managing user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtener lista de usuarios con filtros y paginación
   */
  static async getUsers(filters = {}, options = {}) {
    try {
      let query = db.collection('users');

      // Aplicar filtros
      if (filters.type) {
        query = query.where('type', '==', filters.type);
      }

      if (filters.verified !== undefined) {
        query = query.where('verified', '==', filters.verified);
      }

      if (filters.status) {
        query = query.where('status', '==', filters.status);
      }

      if (filters.city) {
        query = query.where('city', '==', filters.city);
      }

      if (filters.dateFrom) {
        query = query.where('createdAt', '>=', filters.dateFrom);
      }

      if (filters.dateTo) {
        query = query.where('createdAt', '<=', filters.dateTo);
      }

      // Ordenamiento
      const orderBy = options.orderBy || 'createdAt';
      const orderDir = options.orderDir || 'desc';
      query = query.orderBy(orderBy, orderDir);

      // Paginación
      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.startAfter) {
        query = query.startAfter(options.startAfter);
      }

      const snapshot = await query.get();
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        _doc: doc // Para paginación
      }));

      return {
        users,
        hasMore: snapshot.docs.length === (options.limit || Infinity),
        lastDoc: snapshot.docs[snapshot.docs.length - 1] || null
      };

    } catch (error) {
      console.error('Error getting users:', error);
      return {
        users: [],
        hasMore: false,
        lastDoc: null
      };
    }
  }

  /**
   * Obtener estadísticas detalladas de un usuario
   */
  static async getUserStats(userId) {
    try {
      const user = await db.collection('users').doc(userId).get();
      if (!user.exists) {
        throw new Error('Usuario no encontrado');
      }

      const userData = user.data();
      const stats = {
        profile: userData,
        createdAt: userData.createdAt,
        lastLoginAt: userData.lastLoginAt
      };

      if (userData.type === 'professional') {
        // Estadísticas para profesionales
        const bookings = await db.collection('bookings')
          .where('professionalId', '==', userId)
          .get();

        const bookingData = bookings.docs.map(doc => doc.data());
        
        stats.professional = {
          totalBookings: bookingData.length,
          completedBookings: bookingData.filter(b => b.status === 'completed').length,
          cancelledBookings: bookingData.filter(b => b.status === 'cancelled').length,
          totalEarnings: bookingData
            .filter(b => b.status === 'completed')
            .reduce((sum, b) => sum + (b.payment?.amount || 0), 0),
          averageRating: userData.stats?.averageRating || 0,
          totalReviews: userData.stats?.reviewCount || 0,
          joinDate: userData.createdAt,
          lastBooking: bookingData.length > 0 
            ? Math.max(...bookingData.map(b => b.createdAt))
            : null
        };
      } else {
        // Estadísticas para clientes
        const bookings = await db.collection('bookings')
          .where('clientId', '==', userId)
          .get();

        const bookingData = bookings.docs.map(doc => doc.data());
        
        stats.client = {
          totalBookings: bookingData.length,
          completedBookings: bookingData.filter(b => b.status === 'completed').length,
          cancelledBookings: bookingData.filter(b => b.status === 'cancelled').length,
          totalSpent: bookingData
            .filter(b => b.status === 'completed')
            .reduce((sum, b) => sum + (b.payment?.amount || 0), 0),
          favoriteServices: this.getFavoriteServices(bookingData),
          joinDate: userData.createdAt,
          lastBooking: bookingData.length > 0 
            ? Math.max(...bookingData.map(b => b.createdAt))
            : null
        };
      }

      return stats;

    } catch (error) {
      console.error('Error getting user stats:', error);
      return {};
    }
  }

  /**
   * Exportar datos a CSV/Excel
   */
  static async exportData(type, filters = {}, format = 'csv') {
    try {
      let data = [];
      let headers = [];

      switch (type) {
        case 'users':
          const usersData = await this.getUsers(filters, { limit: 10000 });
          data = usersData.users;
          headers = ['ID', 'Nombre', 'Email', 'Tipo', 'Verificado', 'Ciudad', 'Fecha Registro'];
          break;

        case 'bookings':
          const bookingsData = await this.getBookingAnalytics('month');
          data = bookingsData.rawData || [];
          headers = ['ID', 'Cliente', 'Profesional', 'Servicio', 'Fecha', 'Estado', 'Monto'];
          break;

        case 'revenue':
          const revenueData = await this.getFinancialReports('month');
          data = revenueData.rawTransactions || [];
          headers = ['ID', 'Tipo', 'Monto', 'Método Pago', 'Estado', 'Fecha'];
          break;

        default:
          throw new Error('Tipo de exportación no válido');
      }

      // Generar archivo según formato
      if (format === 'csv') {
        return this.generateCSV(data, headers);
      } else if (format === 'excel') {
        return this.generateExcel(data, headers);
      }

    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  // Métodos auxiliares privados
  static async getTotalUsers() {
    const snapshot = await db.collection('users').get();
    return snapshot.size;
  }

  static async getNewUsers(startDate, endDate) {
    const snapshot = await db.collection('users')
      .where('createdAt', '>=', startDate.getTime())
      .where('createdAt', '<=', endDate.getTime())
      .get();
    return snapshot.size;
  }

  static async getTotalProfessionals() {
    const snapshot = await db.collection('users')
      .where('type', '==', 'professional')
      .get();
    return snapshot.size;
  }

  static async getNewProfessionals(startDate, endDate) {
    const snapshot = await db.collection('users')
      .where('type', '==', 'professional')
      .where('createdAt', '>=', startDate.getTime())
      .where('createdAt', '<=', endDate.getTime())
      .get();
    return snapshot.size;
  }

  static calculateGrowth(total, newCount, period) {
    const periodMultiplier = {
      'day': 365,
      'week': 52,
      'month': 12,
      'year': 1
    }[period] || 1;

    const previous = total - newCount;
    if (previous === 0) return newCount > 0 ? 100 : 0;
    
    return ((newCount / previous) * 100 * periodMultiplier).toFixed(1);
  }

  static groupBy(array, key) {
    return array.reduce((groups, item) => {
      const value = item[key] || 'Sin definir';
      groups[value] = (groups[value] || 0) + 1;
      return groups;
    }, {});
  }

  static async logAdminAction(userId, action) {
    await db.collection('admin_audit_log').add({
      userId,
      ...action,
      createdAt: Date.now()
    });
  }

  static async notifyUserOfAdminAction(userId, action, reason) {
    // Implementar notificación al usuario
    console.log(`Notifying user ${userId} of admin action: ${action}`);
  }

  static generateCSV(data, headers) {
    // Implementar generación de CSV
    return 'CSV content';
  }

  static generateExcel(data, headers) {
    // Implementar generación de Excel
    return 'Excel content';
  }
}
```

### AdminDashboard Component
```javascript
// src/admin/pages/AdminDashboard.js
export class AdminDashboard {
  constructor() {
    this.metrics = {};
    this.chartData = {};
    this.refreshInterval = null;
  }

  render() {
    return `
      <div class="admin-dashboard">
        <!-- Header -->
        <div class="dashboard-header bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Panel de Administración</h1>
              <p class="text-gray-600">Dashboard principal de Kalos</p>
            </div>
            
            <div class="flex items-center space-x-4">
              <!-- Period selector -->
              <select id="period-selector" class="border border-gray-300 rounded-md px-3 py-2">
                <option value="day">Último día</option>
                <option value="week" selected>Última semana</option>
                <option value="month">Último mes</option>
                <option value="year">Último año</option>
              </select>
              
              <!-- Refresh button -->
              <button id="refresh-btn" class="bg-brand text-white px-4 py-2 rounded-md hover:bg-brand-hover">
                <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Actualizar
              </button>
            </div>
          </div>
        </div>

        <!-- Metrics Cards -->
        <div class="metrics-section p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            ${this.renderMetricsCards()}
          </div>
        </div>

        <!-- Charts Section -->
        <div class="charts-section px-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Revenue Chart -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold mb-4">Ingresos por Día</h3>
              <div id="revenue-chart" class="h-64"></div>
            </div>
            
            <!-- Bookings Chart -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold mb-4">Reservas por Día</h3>
              <div id="bookings-chart" class="h-64"></div>
            </div>
          </div>
        </div>

        <!-- Quick Actions & Recent Activity -->
        <div class="bottom-section px-6 pb-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Quick Actions -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold mb-4">Acciones Rápidas</h3>
              <div class="grid grid-cols-2 gap-4">
                <button class="quick-action-btn border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-brand hover:bg-gray-50 transition-colors" data-action="verify-users">
                  <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="block text-sm font-medium">Verificar Usuarios</span>
                  <span class="block text-xs text-gray-600" id="pending-verifications">Cargando...</span>
                </button>
                
                <button class="quick-action-btn border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-brand hover:bg-gray-50 transition-colors" data-action="moderate-content">
                  <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.598 0L4.27 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <span class="block text-sm font-medium">Moderar Contenido</span>
                  <span class="block text-xs text-gray-600" id="pending-reports">Cargando...</span>
                </button>
                
                <button class="quick-action-btn border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-brand hover:bg-gray-50 transition-colors" data-action="export-data">
                  <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span class="block text-sm font-medium">Exportar Datos</span>
                  <span class="block text-xs text-gray-600">Generar reportes</span>
                </button>
                
                <button class="quick-action-btn border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-brand hover:bg-gray-50 transition-colors" data-action="platform-config">
                  <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <span class="block text-sm font-medium">Configuración</span>
                  <span class="block text-xs text-gray-600">Ajustes de plataforma</span>
                </button>
              </div>
            </div>
            
            <!-- Recent Activity -->
            <div class="bg-white rounded-lg shadow p-6">
              <h3 class="text-lg font-semibold mb-4">Actividad Reciente</h3>
              <div id="recent-activity" class="space-y-3">
                <!-- Activity items will be loaded here -->
                <div class="text-center py-8 text-gray-500">
                  Cargando actividad reciente...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderMetricsCards() {
    const { users, professionals, bookings, revenue } = this.metrics;
    
    const cards = [
      {
        title: 'Usuarios Totales',
        value: users?.total || 0,
        change: users?.growth || 0,
        icon: 'users',
        color: 'blue'
      },
      {
        title: 'Profesionales',
        value: professionals?.total || 0,
        change: professionals?.growth || 0,
        icon: 'badge-check',
        color: 'green'
      },
      {
        title: 'Reservas',
        value: bookings?.total || 0,
        change: bookings?.growth || 0,
        icon: 'calendar',
        color: 'purple'
      },
      {
        title: 'Ingresos',
        value: `Bs. ${(revenue?.total || 0).toLocaleString()}`,
        change: revenue?.growth || 0,
        icon: 'currency-dollar',
        color: 'yellow'
      }
    ];

    return cards.map(card => `
      <div class="metric-card bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">${card.title}</p>
            <p class="text-2xl font-bold text-gray-900">${card.value}</p>
          </div>
          <div class="p-3 bg-${card.color}-100 rounded-full">
            ${this.getIcon(card.icon, card.color)}
          </div>
        </div>
        <div class="mt-4 flex items-center">
          <span class="text-sm font-medium ${card.change >= 0 ? 'text-green-600' : 'text-red-600'}">
            ${card.change >= 0 ? '+' : ''}${card.change}%
          </span>
          <span class="text-sm text-gray-600 ml-1">vs período anterior</span>
        </div>
      </div>
    `).join('');
  }

  getIcon(iconName, color) {
    const icons = {
      users: `<svg class="w-6 h-6 text-${color}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path></svg>`,
      'badge-check': `<svg class="w-6 h-6 text-${color}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>`,
      calendar: `<svg class="w-6 h-6 text-${color}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`,
      'currency-dollar': `<svg class="w-6 h-6 text-${color}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path></svg>`
    };
    
    return icons[iconName] || '';
  }

  async mount() {
    await this.loadInitialData();
    this.bindEvents();
    this.startAutoRefresh();
  }

  async loadInitialData() {
    try {
      const period = document.getElementById('period-selector')?.value || 'week';
      
      // Cargar métricas principales
      this.metrics = await AdminService.getDashboardMetrics(period);
      
      // Cargar datos para gráficos
      await this.loadChartData(period);
      
      // Cargar actividad reciente
      await this.loadRecentActivity();
      
      // Cargar contadores para acciones rápidas
      await this.loadQuickActionCounts();
      
      this.rerender();
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  bindEvents() {
    // Period selector
    const periodSelector = document.getElementById('period-selector');
    if (periodSelector) {
      periodSelector.addEventListener('change', (e) => {
        this.loadInitialData();
      });
    }

    // Refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.loadInitialData();
      });
    }

    // Quick action buttons
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        this.handleQuickAction(action);
      });
    });
  }

  handleQuickAction(action) {
    switch (action) {
      case 'verify-users':
        window.router.navigate('/admin/users?filter=pending_verification');
        break;
      case 'moderate-content':
        window.router.navigate('/admin/moderation');
        break;
      case 'export-data':
        this.showExportModal();
        break;
      case 'platform-config':
        window.router.navigate('/admin/settings');
        break;
    }
  }

  startAutoRefresh() {
    // Refresh every 5 minutes
    this.refreshInterval = setInterval(() => {
      this.loadInitialData();
    }, 5 * 60 * 1000);
  }

  destroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  rerender() {
    const container = document.querySelector('.admin-dashboard')?.parentNode;
    if (container) {
      container.innerHTML = this.render();
      this.bindEvents();
    }
  }
}
```

## 🧪 Testing

### Admin Panel Tests
- [ ] Dashboard metrics load correctly
- [ ] User management actions work
- [ ] Analytics and reports generate accurately
- [ ] Export functionality works
- [ ] Permission checks are enforced

### Security Tests
- [ ] Only admins can access admin panel
- [ ] All admin actions are logged
- [ ] Sensitive data is protected
- [ ] Rate limiting on admin actions

## 🚀 Deployment

### Admin Security
- Role-based access control
- Admin action logging
- Secure admin routes
- Regular security audits

### Performance Optimization
- Caching for dashboard metrics
- Pagination for large datasets
- Optimized queries for analytics

## 📦 Dependencies
- Firebase Firestore para datos
- Chart.js para gráficos
- CSV/Excel export libraries
- Role-based authentication

## 🔗 Relaciones
- **Usa**: Todos los servicios de la plataforma
- **Depende de**: fase1-0004-auth-base-system
- **Gestiona**: fase6-0027-user-management, fase6-0028-content-moderation

---

**Estado**: 🟡 Pendiente  
**Prioridad**: Alta  
**Estimación**: 24 horas  
**Asignado**: Senior Full Stack Developer  

**Sprint**: Sprint 6 - Administración  
**Deadline**: 7 octubre 2025