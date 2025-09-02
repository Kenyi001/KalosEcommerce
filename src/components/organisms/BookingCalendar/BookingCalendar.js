/**
 * Booking Calendar Organism Component - Kalos Design System
 * Advanced calendar widget for appointment booking
 */

import { BaseComponent } from '../../BaseComponent.js';
import { renderIcon } from '../../atoms/Icon/Icon.js';
import { Button } from '../../atoms/Button/Button.js';

export class BookingCalendar extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      professionalId: '',
      serviceId: '',
      selectedDate: null,
      selectedTime: null,
      availableDates: [],        // Array of available date strings
      availableSlots: {},        // Object with date keys and time slot arrays
      blockedDates: [],          // Array of blocked date strings
      workingHours: {
        monday: { start: '09:00', end: '18:00' },
        tuesday: { start: '09:00', end: '18:00' },
        wednesday: { start: '09:00', end: '18:00' },
        thursday: { start: '09:00', end: '18:00' },
        friday: { start: '09:00', end: '18:00' },
        saturday: { start: '09:00', end: '14:00' },
        sunday: null // Closed
      },
      serviceDuration: 60,       // Duration in minutes
      slotInterval: 30,          // Slot interval in minutes
      maxAdvanceDays: 60,        // Maximum days in advance to book
      minAdvanceDays: 0,         // Minimum days in advance to book
      showTimeSlots: true,
      allowPastDates: false,
      locale: 'es-BO',
      onDateSelect: () => {},
      onTimeSelect: () => {},
      onSlotAvailable: () => {}, // Callback to fetch slots for a date
      className: '',
      ...props
    };

    this.state = {
      currentDate: new Date(),
      viewDate: new Date(),      // Date being viewed in calendar
      selectedDate: this.props.selectedDate ? new Date(this.props.selectedDate) : null,
      selectedTime: this.props.selectedTime,
      availableSlots: { ...this.props.availableSlots },
      loading: false,
      loadingDate: null
    };

    this.components = new Map();
  }

  render() {
    const { showTimeSlots, className } = this.props;
    const { viewDate, selectedDate, selectedTime } = this.state;

    return `
      <div class="booking-calendar ${className}" data-component="booking-calendar">
        <div class="calendar-container">
          <!-- Calendar Header -->
          <div class="calendar-header">
            <button class="calendar-nav calendar-prev" aria-label="Mes anterior">
              ${renderIcon('chevron-left', { size: '20' })}
            </button>
            
            <div class="calendar-title">
              <h3 class="calendar-month">${this.formatMonth(viewDate)}</h3>
            </div>
            
            <button class="calendar-nav calendar-next" aria-label="Mes siguiente">
              ${renderIcon('chevron-right', { size: '20' })}
            </button>
          </div>

          <!-- Days of week header -->
          <div class="calendar-weekdays">
            ${this.getDaysOfWeek().map(day => `
              <div class="calendar-weekday">${day}</div>
            `).join('')}
          </div>

          <!-- Calendar grid -->
          <div class="calendar-grid">
            ${this.renderCalendarDays()}
          </div>
        </div>

        ${showTimeSlots ? `
          <div class="time-slots-container">
            <div class="time-slots-header">
              <h4>Horarios disponibles</h4>
              ${selectedDate ? `
                <span class="selected-date">${this.formatDate(selectedDate)}</span>
              ` : `
                <span class="no-date-selected">Selecciona una fecha</span>
              `}
            </div>
            
            <div class="time-slots-content">
              ${this.renderTimeSlots()}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderCalendarDays() {
    const { viewDate, selectedDate, currentDate } = this.state;
    const { allowPastDates, maxAdvanceDays, minAdvanceDays } = this.props;
    
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    
    // Get first day of month and last day
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get starting date (might include days from previous month)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate 42 days (6 weeks)
    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dateStr = this.formatDateString(date);
      const isCurrentMonth = date.getMonth() === month;
      const isToday = this.isSameDay(date, currentDate);
      const isSelected = selectedDate && this.isSameDay(date, selectedDate);
      const isPast = date < currentDate;
      const isTooFar = this.getDaysDifference(currentDate, date) > maxAdvanceDays;
      const isTooSoon = this.getDaysDifference(currentDate, date) < minAdvanceDays;
      const isBlocked = this.props.blockedDates.includes(dateStr);
      const isAvailable = this.isDateAvailable(date);
      
      let isDisabled = false;
      let disabledReason = '';
      
      if (!isCurrentMonth) {
        isDisabled = true;
      } else if (isPast && !allowPastDates) {
        isDisabled = true;
        disabledReason = 'Fecha pasada';
      } else if (isTooFar) {
        isDisabled = true;
        disabledReason = 'Muy lejos';
      } else if (isTooSoon) {
        isDisabled = true;
        disabledReason = 'Muy pronto';
      } else if (isBlocked) {
        isDisabled = true;
        disabledReason = 'No disponible';
      } else if (!isAvailable) {
        isDisabled = true;
        disabledReason = 'Sin horarios';
      }

      const dayClasses = [
        'calendar-day',
        isCurrentMonth ? 'current-month' : 'other-month',
        isToday ? 'today' : '',
        isSelected ? 'selected' : '',
        isDisabled ? 'disabled' : 'available',
        isAvailable && !isDisabled ? 'has-slots' : ''
      ].filter(Boolean).join(' ');

      days.push(`
        <button 
          class="${dayClasses}"
          data-date="${dateStr}"
          ${isDisabled ? 'disabled' : ''}
          ${disabledReason ? `title="${disabledReason}"` : ''}
          aria-label="${this.formatDateAccessible(date)}"
        >
          <span class="day-number">${date.getDate()}</span>
          ${isAvailable && !isDisabled ? `
            <span class="day-indicator"></span>
          ` : ''}
        </button>
      `);
    }

    return days.join('');
  }

  renderTimeSlots() {
    const { selectedDate, availableSlots, loading, loadingDate } = this.state;
    const { selectedTime } = this.state;
    
    if (!selectedDate) {
      return `
        <div class="time-slots-empty">
          <div class="empty-icon">
            ${renderIcon('calendar', { size: '48' })}
          </div>
          <p>Selecciona una fecha para ver los horarios disponibles</p>
        </div>
      `;
    }

    const dateStr = this.formatDateString(selectedDate);
    
    if (loading && loadingDate === dateStr) {
      return `
        <div class="time-slots-loading">
          <div class="loading-spinner">
            ${this.renderSpinner()}
          </div>
          <p>Cargando horarios...</p>
        </div>
      `;
    }

    const slots = availableSlots[dateStr] || [];
    
    if (slots.length === 0) {
      return `
        <div class="time-slots-empty">
          <div class="empty-icon">
            ${renderIcon('clock', { size: '48' })}
          </div>
          <p>No hay horarios disponibles para esta fecha</p>
          <button class="refresh-slots-btn">Actualizar</button>
        </div>
      `;
    }

    // Group slots by time period
    const periods = this.groupSlotsByPeriod(slots);

    return `
      <div class="time-slots-grid">
        ${Object.entries(periods).map(([period, periodSlots]) => `
          <div class="time-period">
            <div class="time-period-header">
              <h5>${period}</h5>
            </div>
            <div class="time-period-slots">
              ${periodSlots.map(slot => {
                const isSelected = selectedTime === slot.time;
                const isDisabled = !slot.available;
                
                return `
                  <button 
                    class="time-slot ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}"
                    data-time="${slot.time}"
                    ${isDisabled ? 'disabled' : ''}
                    title="${slot.available ? '' : slot.reason || 'No disponible'}"
                  >
                    ${this.formatTime(slot.time)}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  groupSlotsByPeriod(slots) {
    const periods = {
      'Mañana': [],
      'Tarde': [],
      'Noche': []
    };

    slots.forEach(slot => {
      const hour = parseInt(slot.time.split(':')[0]);
      
      if (hour < 12) {
        periods['Mañana'].push(slot);
      } else if (hour < 18) {
        periods['Tarde'].push(slot);
      } else {
        periods['Noche'].push(slot);
      }
    });

    // Remove empty periods
    Object.keys(periods).forEach(period => {
      if (periods[period].length === 0) {
        delete periods[period];
      }
    });

    return periods;
  }

  renderSpinner() {
    return `
      <svg class="spinner" viewBox="0 0 24 24" fill="none">
        <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
        <circle class="spinner-head" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416" />
      </svg>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="booking-calendar"]';
    
    // Load slots for selected date if any
    if (this.state.selectedDate) {
      this.loadSlotsForDate(this.state.selectedDate);
    }
  }

  bindEvents() {
    // Calendar navigation
    const prevBtn = this.element.querySelector('.calendar-prev');
    const nextBtn = this.element.querySelector('.calendar-next');
    
    if (prevBtn) {
      this.addEventListener(prevBtn, 'click', () => {
        this.navigateMonth(-1);
      });
    }
    
    if (nextBtn) {
      this.addEventListener(nextBtn, 'click', () => {
        this.navigateMonth(1);
      });
    }

    // Date selection
    const dayButtons = this.element.querySelectorAll('.calendar-day:not(.disabled)');
    dayButtons.forEach(btn => {
      this.addEventListener(btn, 'click', (e) => {
        const dateStr = e.currentTarget.dataset.date;
        const date = new Date(dateStr);
        this.selectDate(date);
      });
    });

    // Time slot selection
    const timeSlots = this.element.querySelectorAll('.time-slot:not(.disabled)');
    timeSlots.forEach(slot => {
      this.addEventListener(slot, 'click', (e) => {
        const time = e.currentTarget.dataset.time;
        this.selectTime(time);
      });
    });

    // Refresh slots
    const refreshBtn = this.element.querySelector('.refresh-slots-btn');
    if (refreshBtn) {
      this.addEventListener(refreshBtn, 'click', () => {
        if (this.state.selectedDate) {
          this.loadSlotsForDate(this.state.selectedDate, true);
        }
      });
    }

    // Keyboard navigation
    this.addEventListener(this.element, 'keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });
  }

  handleKeyboardNavigation(e) {
    const { selectedDate, viewDate } = this.state;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (selectedDate) {
          const newDate = new Date(selectedDate);
          newDate.setDate(newDate.getDate() - 1);
          this.selectDate(newDate);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (selectedDate) {
          const newDate = new Date(selectedDate);
          newDate.setDate(newDate.getDate() + 1);
          this.selectDate(newDate);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (selectedDate) {
          const newDate = new Date(selectedDate);
          newDate.setDate(newDate.getDate() - 7);
          this.selectDate(newDate);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (selectedDate) {
          const newDate = new Date(selectedDate);
          newDate.setDate(newDate.getDate() + 7);
          this.selectDate(newDate);
        }
        break;
      case 'PageUp':
        e.preventDefault();
        this.navigateMonth(-1);
        break;
      case 'PageDown':
        e.preventDefault();
        this.navigateMonth(1);
        break;
      case 'Home':
        e.preventDefault();
        this.setState({ viewDate: new Date() });
        break;
    }
  }

  navigateMonth(direction) {
    const { viewDate } = this.state;
    const newDate = new Date(viewDate);
    newDate.setMonth(newDate.getMonth() + direction);
    
    this.setState({ viewDate: newDate });
  }

  selectDate(date) {
    const { selectedDate } = this.state;
    
    // Check if date is valid and available
    if (!this.isDateSelectable(date)) {
      return;
    }

    // If same date selected, do nothing
    if (selectedDate && this.isSameDay(date, selectedDate)) {
      return;
    }

    // Update view month if necessary
    let newViewDate = this.state.viewDate;
    if (date.getMonth() !== newViewDate.getMonth() || 
        date.getFullYear() !== newViewDate.getFullYear()) {
      newViewDate = new Date(date);
    }

    this.setState({ 
      selectedDate: date, 
      selectedTime: null, // Reset time selection
      viewDate: newViewDate 
    });

    // Load time slots for this date
    this.loadSlotsForDate(date);

    // Callback
    if (this.props.onDateSelect) {
      this.props.onDateSelect(date);
    }
  }

  selectTime(time) {
    this.setState({ selectedTime: time });

    if (this.props.onTimeSelect) {
      this.props.onTimeSelect(time, this.state.selectedDate);
    }
  }

  async loadSlotsForDate(date, force = false) {
    const dateStr = this.formatDateString(date);
    
    // Skip if already loading or have data (unless forced)
    if ((this.state.loading && this.state.loadingDate === dateStr) || 
        (this.state.availableSlots[dateStr] && !force)) {
      return;
    }

    this.setState({ loading: true, loadingDate: dateStr });

    try {
      if (this.props.onSlotAvailable) {
        const slots = await this.props.onSlotAvailable(dateStr);
        
        this.setState({
          availableSlots: {
            ...this.state.availableSlots,
            [dateStr]: slots || []
          },
          loading: false,
          loadingDate: null
        });
      } else {
        // Generate default slots based on working hours
        const slots = this.generateDefaultSlots(date);
        
        this.setState({
          availableSlots: {
            ...this.state.availableSlots,
            [dateStr]: slots
          },
          loading: false,
          loadingDate: null
        });
      }
    } catch (error) {
      console.error('Error loading time slots:', error);
      this.setState({ loading: false, loadingDate: null });
    }
  }

  generateDefaultSlots(date) {
    const dayName = this.getDayName(date).toLowerCase();
    const workingHours = this.props.workingHours[dayName];
    
    if (!workingHours) {
      return []; // Closed day
    }

    const slots = [];
    const startTime = this.parseTime(workingHours.start);
    const endTime = this.parseTime(workingHours.end);
    const { serviceDuration, slotInterval } = this.props;

    let currentTime = startTime;
    
    while (currentTime + serviceDuration <= endTime) {
      const timeStr = this.formatTimeFromMinutes(currentTime);
      
      slots.push({
        time: timeStr,
        available: true,
        duration: serviceDuration
      });
      
      currentTime += slotInterval;
    }

    return slots;
  }

  // Utility methods
  isDateSelectable(date) {
    const { allowPastDates, maxAdvanceDays, minAdvanceDays } = this.props;
    const { currentDate } = this.state;
    
    const isPast = date < currentDate;
    const daysDiff = this.getDaysDifference(currentDate, date);
    
    if (isPast && !allowPastDates) return false;
    if (daysDiff > maxAdvanceDays) return false;
    if (daysDiff < minAdvanceDays) return false;
    
    const dateStr = this.formatDateString(date);
    if (this.props.blockedDates.includes(dateStr)) return false;
    
    return this.isDateAvailable(date);
  }

  isDateAvailable(date) {
    const dateStr = this.formatDateString(date);
    
    // Check if we have availability data
    if (this.props.availableDates.length > 0) {
      return this.props.availableDates.includes(dateStr);
    }
    
    // Check working hours
    const dayName = this.getDayName(date).toLowerCase();
    return !!this.props.workingHours[dayName];
  }

  isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  getDaysDifference(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((date2 - date1) / oneDay);
  }

  formatDateString(date) {
    return date.toISOString().split('T')[0];
  }

  formatDate(date) {
    return date.toLocaleDateString(this.props.locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDateAccessible(date) {
    return date.toLocaleDateString(this.props.locale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatMonth(date) {
    return date.toLocaleDateString(this.props.locale, {
      month: 'long',
      year: 'numeric'
    });
  }

  formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    
    return date.toLocaleTimeString(this.props.locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  formatTimeFromMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  parseTime(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  getDaysOfWeek() {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - date.getDay() + i);
      days.push(date.toLocaleDateString(this.props.locale, { weekday: 'short' }));
    }
    return days;
  }

  getDayName(date) {
    return date.toLocaleDateString(this.props.locale, { weekday: 'long' });
  }

  // Public methods
  getSelectedDateTime() {
    const { selectedDate, selectedTime } = this.state;
    
    if (!selectedDate || !selectedTime) {
      return null;
    }

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const dateTime = new Date(selectedDate);
    dateTime.setHours(hours, minutes, 0, 0);
    
    return dateTime;
  }

  setSelectedDate(date) {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    this.selectDate(date);
  }

  setSelectedTime(time) {
    this.selectTime(time);
  }

  updateAvailableSlots(dateSlots) {
    this.setState({
      availableSlots: { ...this.state.availableSlots, ...dateSlots }
    });
  }

  clearSelection() {
    this.setState({ 
      selectedDate: null, 
      selectedTime: null 
    });
  }
}

// Factory function
export function createBookingCalendar(props) {
  return new BookingCalendar(props);
}