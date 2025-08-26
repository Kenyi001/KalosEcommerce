import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { ProfessionalsListPage } from '../List.js';

// Mock the professional service
vi.mock('../../services/professionals.js', () => ({
  professionalService: {
    searchProfessionals: vi.fn()
  }
}));

// Mock the ProfessionalCard component
vi.mock('../../components/professionals/ProfessionalCard.js', () => ({
  ProfessionalCard: {
    create: vi.fn().mockReturnValue({
      mount: vi.fn()
    })
  }
}));

// Mock the professional model constants
vi.mock('../../models/professional.js', () => ({
  SERVICE_CATEGORIES: {
    hair: 'hair',
    nails: 'nails',
    makeup: 'makeup'
  },
  LOCATIONS: {
    departments: ['La Paz', 'Santa Cruz', 'Cochabamba'],
    cities: {
      'La Paz': ['La Paz', 'El Alto'],
      'Santa Cruz': ['Santa Cruz de la Sierra', 'Montero'],
      'Cochabamba': ['Cochabamba', 'Quillacollo']
    }
  }
}));

describe('ProfessionalsListPage', () => {
  let dom;
  let document;
  let container;
  let page;

  beforeEach(() => {
    // Setup JSDOM
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <div id="container"></div>
        </body>
      </html>
    `);
    global.document = dom.window.document;
    global.window = dom.window;
    document = dom.window.document;
    container = document.getElementById('container');

    // Mock setTimeout
    global.setTimeout = vi.fn((callback) => callback());

    page = new ProfessionalsListPage();
  });

  afterEach(() => {
    container.innerHTML = '';
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with default state', () => {
      expect(page.state).toMatchObject({
        professionals: [],
        loading: false,
        error: null,
        filters: {
          category: '',
          department: '',
          city: '',
          minRating: 0,
          sortBy: 'stats.averageRating',
          sortOrder: 'desc'
        },
        pagination: {
          hasMore: true,
          lastDoc: null,
          currentPage: 1
        },
        searchTerm: ''
      });
    });
  });

  describe('loadProfessionals', () => {
    it('should load professionals successfully', async () => {
      const mockProfessionals = [
        {
          id: 'prof1',
          personalInfo: { firstName: 'John' },
          businessInfo: { businessName: 'Hair Studio' }
        },
        {
          id: 'prof2',
          personalInfo: { firstName: 'Jane' },
          businessInfo: { businessName: 'Beauty Salon' }
        }
      ];

      const mockResult = {
        professionals: mockProfessionals,
        hasMore: false,
        lastDoc: null
      };

      const { professionalService } = await import('../../services/professionals.js');
      professionalService.searchProfessionals.mockResolvedValue(mockResult);

      await page.loadProfessionals();

      expect(page.state.professionals).toEqual(mockProfessionals);
      expect(page.state.loading).toBe(false);
      expect(page.state.error).toBe(null);
      expect(page.state.pagination.hasMore).toBe(false);
    });

    it('should handle loading errors', async () => {
      const { professionalService } = await import('../../services/professionals.js');
      professionalService.searchProfessionals.mockRejectedValue(new Error('Network error'));

      await page.loadProfessionals();

      expect(page.state.error).toBe('Error al cargar los profesionales. Inténtalo de nuevo.');
      expect(page.state.loading).toBe(false);
    });

    it('should append professionals when loading more', async () => {
      const existingProfessionals = [
        { id: 'prof1', personalInfo: { firstName: 'John' } }
      ];
      const newProfessionals = [
        { id: 'prof2', personalInfo: { firstName: 'Jane' } }
      ];

      page.setState({ professionals: existingProfessionals });

      const mockResult = {
        professionals: newProfessionals,
        hasMore: true,
        lastDoc: { id: 'last' }
      };

      const { professionalService } = await import('../../services/professionals.js');
      professionalService.searchProfessionals.mockResolvedValue(mockResult);

      await page.loadProfessionals(true); // append = true

      expect(page.state.professionals).toHaveLength(2);
      expect(page.state.professionals[0].id).toBe('prof1');
      expect(page.state.professionals[1].id).toBe('prof2');
      expect(page.state.pagination.currentPage).toBe(2);
    });
  });

  describe('handleFilterChange', () => {
    it('should update filter and reload professionals', async () => {
      const { professionalService } = await import('../../services/professionals.js');
      professionalService.searchProfessionals.mockResolvedValue({
        professionals: [],
        hasMore: false,
        lastDoc: null
      });

      page.handleFilterChange('category', 'hair');

      expect(page.state.filters.category).toBe('hair');
      expect(page.state.pagination.currentPage).toBe(1);
      expect(page.state.pagination.lastDoc).toBe(null);
      
      // Should call loadProfessionals after timeout
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 300);
    });
  });

  describe('handleSearch', () => {
    it('should update search term', () => {
      page.handleSearch('beauty salon');

      expect(page.state.searchTerm).toBe('beauty salon');
    });
  });

  describe('handleLoadMore', () => {
    it('should load more professionals when hasMore is true', async () => {
      page.setState({
        pagination: { hasMore: true },
        loading: false
      });

      const mockLoadProfessionals = vi.spyOn(page, 'loadProfessionals').mockResolvedValue();

      page.handleLoadMore();

      expect(mockLoadProfessionals).toHaveBeenCalledWith(true);
    });

    it('should not load more when hasMore is false', async () => {
      page.setState({
        pagination: { hasMore: false },
        loading: false
      });

      const mockLoadProfessionals = vi.spyOn(page, 'loadProfessionals').mockResolvedValue();

      page.handleLoadMore();

      expect(mockLoadProfessionals).not.toHaveBeenCalled();
    });

    it('should not load more when already loading', async () => {
      page.setState({
        pagination: { hasMore: true },
        loading: true
      });

      const mockLoadProfessionals = vi.spyOn(page, 'loadProfessionals').mockResolvedValue();

      page.handleLoadMore();

      expect(mockLoadProfessionals).not.toHaveBeenCalled();
    });
  });

  describe('render', () => {
    it('should render page with all sections', () => {
      const html = page.render();

      // Check main sections
      expect(html).toContain('Profesionales de Belleza');
      expect(html).toContain('Buscar profesionales...');
      expect(html).toContain('Categoría');
      expect(html).toContain('Departamento');
      expect(html).toContain('Ciudad');
      expect(html).toContain('Calificación mínima');
      expect(html).toContain('Ordenar por');
      expect(html).toContain('professionals-grid');
    });

    it('should show loading state', () => {
      page.setState({ loading: true, professionals: [] });
      const html = page.render();

      expect(html).toContain('Cargando...');
    });

    it('should show error message', () => {
      page.setState({ 
        error: 'Test error message',
        loading: false,
        professionals: []
      });
      const html = page.render();

      expect(html).toContain('Test error message');
      expect(html).toContain('bg-red-50');
    });

    it('should show empty state', () => {
      page.setState({ 
        loading: false,
        professionals: [],
        error: null
      });
      const html = page.render();

      expect(html).toContain('No se encontraron profesionales');
      expect(html).toContain('Intenta ajustar tus filtros');
    });

    it('should show load more button when hasMore is true', () => {
      page.setState({
        professionals: [{ id: 'prof1' }],
        pagination: { hasMore: true },
        loading: false
      });
      const html = page.render();

      expect(html).toContain('Cargar más profesionales');
      expect(html).toContain('load-more-btn');
    });

    it('should show professionals count', () => {
      page.setState({
        professionals: [{ id: 'prof1' }, { id: 'prof2' }],
        loading: false
      });
      const html = page.render();

      expect(html).toContain('2 profesionales encontrados');
    });

    it('should show singular professional count', () => {
      page.setState({
        professionals: [{ id: 'prof1' }],
        loading: false
      });
      const html = page.render();

      expect(html).toContain('1 profesional encontrado');
    });
  });

  describe('_formatCategoryName', () => {
    it('should format known categories', () => {
      expect(page._formatCategoryName('hair')).toBe('Cabello');
      expect(page._formatCategoryName('nails')).toBe('Uñas');
      expect(page._formatCategoryName('makeup')).toBe('Maquillaje');
    });

    it('should return original category for unknown categories', () => {
      expect(page._formatCategoryName('unknown')).toBe('unknown');
    });
  });

  describe('_getCitiesForDepartment', () => {
    it('should return cities for valid department', () => {
      const cities = page._getCitiesForDepartment('La Paz');
      expect(cities).toEqual(['La Paz', 'El Alto']);
    });

    it('should return empty array for invalid department', () => {
      const cities = page._getCitiesForDepartment('Invalid');
      expect(cities).toEqual([]);
    });

    it('should return empty array for empty department', () => {
      const cities = page._getCitiesForDepartment('');
      expect(cities).toEqual([]);
    });
  });

  describe('mount', () => {
    it('should mount and load initial data', async () => {
      const { professionalService } = await import('../../services/professionals.js');
      professionalService.searchProfessionals.mockResolvedValue({
        professionals: [],
        hasMore: false,
        lastDoc: null
      });

      const mockAttachEvents = vi.spyOn(page, 'attachEvents').mockImplementation(() => {});

      page.mount(container);

      expect(container.innerHTML).toBeTruthy();
      expect(mockAttachEvents).toHaveBeenCalled();
    });

    it('should mount using selector string', async () => {
      const { professionalService } = await import('../../services/professionals.js');
      professionalService.searchProfessionals.mockResolvedValue({
        professionals: [],
        hasMore: false,
        lastDoc: null
      });

      const mockAttachEvents = vi.spyOn(page, 'attachEvents').mockImplementation(() => {});

      page.mount('#container');

      expect(container.innerHTML).toBeTruthy();
      expect(mockAttachEvents).toHaveBeenCalled();
    });
  });

  describe('static create', () => {
    it('should create new instance', () => {
      const instance = ProfessionalsListPage.create();
      
      expect(instance).toBeInstanceOf(ProfessionalsListPage);
    });
  });
});