import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { ProfessionalCard } from '../ProfessionalCard.js';

describe('ProfessionalCard', () => {
  let dom;
  let document;
  let container;

  beforeEach(() => {
    // Setup JSDOM
    dom = new JSDOM('<!DOCTYPE html><html><body><div id="container"></div></body></html>');
    global.document = dom.window.document;
    global.window = dom.window;
    document = dom.window.document;
    container = document.getElementById('container');
  });

  afterEach(() => {
    // Cleanup
    container.innerHTML = '';
    vi.restoreAllMocks();
  });

  const mockProfessional = {
    id: 'prof-123',
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      profileImage: '/path/to/image.jpg'
    },
    businessInfo: {
      businessName: 'Hair Studio John',
      description: 'Professional hair services with 10+ years of experience',
      categories: ['hair', 'makeup']
    },
    location: {
      city: 'La Paz',
      zone: 'Centro',
      homeService: true
    },
    stats: {
      averageRating: 4.5,
      totalReviews: 25,
      totalServices: 8
    }
  };

  describe('render', () => {
    it('should render professional card with all information', () => {
      const card = new ProfessionalCard(mockProfessional);
      const html = card.render();

      // Check if main elements are present
      expect(html).toContain('professional-card');
      expect(html).toContain('Hair Studio John');
      expect(html).toContain('John');
      expect(html).toContain('Professional hair services');
      expect(html).toContain('La Paz, Centro');
      expect(html).toContain('4.5');
      expect(html).toContain('25 reseñas');
      expect(html).toContain('8 servicios');
    });

    it('should render card with default values when data is missing', () => {
      const minimalProfessional = {
        id: 'prof-123',
        personalInfo: {},
        businessInfo: {},
        location: {},
        stats: {}
      };

      const card = new ProfessionalCard(minimalProfessional);
      const html = card.render();

      expect(html).toContain('Sin nombre');
      expect(html).toContain('Profesional');
      expect(html).toContain('Sin descripción');
      expect(html).toContain('Ubicación no especificada');
    });

    it('should handle missing profile image', () => {
      const professionalWithoutImage = {
        ...mockProfessional,
        personalInfo: {
          ...mockProfessional.personalInfo,
          profileImage: ''
        }
      };

      const card = new ProfessionalCard(professionalWithoutImage);
      const html = card.render();

      // Should show default avatar SVG
      expect(html).toContain('w-20 h-20 bg-brand-200 rounded-full');
      expect(html).toContain('<svg');
    });

    it('should limit displayed categories to 3', () => {
      const professionalWithManyCategories = {
        ...mockProfessional,
        businessInfo: {
          ...mockProfessional.businessInfo,
          categories: ['hair', 'makeup', 'nails', 'skincare', 'massage']
        }
      };

      const card = new ProfessionalCard(professionalWithManyCategories);
      const html = card.render();

      expect(html).toContain('+2 más');
    });

    it('should show rating badge only when rating exists and showStats is true', () => {
      const professionalWithoutRating = {
        ...mockProfessional,
        stats: {
          ...mockProfessional.stats,
          averageRating: 0
        }
      };

      const card = new ProfessionalCard(professionalWithoutRating);
      const html = card.render();

      // Should not contain rating badge
      expect(html).not.toContain('text-yellow-400');
      expect(html).not.toMatch(/\d+\.\d+/); // No decimal rating
    });

    it('should respect options for hiding elements', () => {
      const options = {
        showStats: false,
        showLocation: false,
        showCategories: false,
        clickable: false
      };

      const card = new ProfessionalCard(mockProfessional, options);
      const html = card.render();

      expect(html).not.toContain('25 reseñas');
      expect(html).not.toContain('La Paz, Centro');
      expect(html).not.toContain('Cabello');
      expect(html).not.toContain('cursor-pointer');
      expect(html).not.toContain('hover:transform');
    });

    it('should show reservar button only when home service is available', () => {
      const card = new ProfessionalCard(mockProfessional);
      const html = card.render();

      expect(html).toContain('Reservar');

      const professionalWithoutHomeService = {
        ...mockProfessional,
        location: {
          ...mockProfessional.location,
          homeService: false
        }
      };

      const cardWithoutReservar = new ProfessionalCard(professionalWithoutHomeService);
      const htmlWithoutReservar = cardWithoutReservar.render();

      expect(htmlWithoutReservar).not.toContain('Reservar');
    });
  });

  describe('mount', () => {
    it('should mount card to container', () => {
      const card = new ProfessionalCard(mockProfessional);
      const mountedElement = card.mount(container);

      expect(container.children.length).toBe(1);
      expect(mountedElement).toBeDefined();
      expect(mountedElement.classList.contains('professional-card')).toBe(true);
    });

    it('should mount card to container selector string', () => {
      const card = new ProfessionalCard(mockProfessional);
      card.mount('#container');

      expect(container.children.length).toBe(1);
      expect(container.firstElementChild.classList.contains('professional-card')).toBe(true);
    });

    it('should add click handler when clickable option is true', () => {
      const mockDispatchEvent = vi.fn();
      global.window.dispatchEvent = mockDispatchEvent;

      const card = new ProfessionalCard(mockProfessional, { clickable: true });
      const mountedElement = card.mount(container);

      // Simulate click event (not on button)
      const clickEvent = new dom.window.Event('click');
      mountedElement.dispatchEvent(clickEvent);

      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'view-professional',
          detail: { professionalId: 'prof-123' }
        })
      );
    });

    it('should not trigger click event when clicking on buttons', () => {
      const mockDispatchEvent = vi.fn();
      global.window.dispatchEvent = mockDispatchEvent;

      const card = new ProfessionalCard(mockProfessional, { clickable: true });
      const mountedElement = card.mount(container);

      // Find the button and simulate click
      const button = mountedElement.querySelector('button');
      const clickEvent = new dom.window.Event('click');
      Object.defineProperty(clickEvent, 'target', {
        value: button,
        enumerable: true
      });

      // Mock closest method
      button.closest = vi.fn().mockReturnValue(button);
      
      mountedElement.dispatchEvent(clickEvent);

      // Should not call dispatchEvent for card click
      expect(mockDispatchEvent).not.toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'view-professional'
        })
      );
    });
  });

  describe('static create', () => {
    it('should create new instance', () => {
      const card = ProfessionalCard.create(mockProfessional);
      
      expect(card).toBeInstanceOf(ProfessionalCard);
      expect(card.professional).toEqual(mockProfessional);
    });

    it('should create new instance with options', () => {
      const options = { showStats: false };
      const card = ProfessionalCard.create(mockProfessional, options);
      
      expect(card.options.showStats).toBe(false);
      expect(card.options.clickable).toBe(true); // Default value
    });
  });

  describe('_formatCategory', () => {
    it('should format known categories', () => {
      const card = new ProfessionalCard(mockProfessional);
      
      expect(card._formatCategory('hair')).toBe('Cabello');
      expect(card._formatCategory('nails')).toBe('Uñas');
      expect(card._formatCategory('makeup')).toBe('Maquillaje');
      expect(card._formatCategory('skincare')).toBe('Cuidado de piel');
    });

    it('should return original category for unknown categories', () => {
      const card = new ProfessionalCard(mockProfessional);
      
      expect(card._formatCategory('unknown')).toBe('unknown');
      expect(card._formatCategory('custom-category')).toBe('custom-category');
    });
  });

  describe('action buttons', () => {
    it('should dispatch view-professional event on Ver Perfil button click', () => {
      const mockDispatchEvent = vi.fn();
      global.window.dispatchEvent = mockDispatchEvent;

      const card = new ProfessionalCard(mockProfessional);
      card.mount(container);

      const html = container.innerHTML;
      expect(html).toContain(`dispatchEvent(new CustomEvent('view-professional', { detail: { professionalId: '${mockProfessional.id}' } }))`);
    });

    it('should dispatch book-service event on Reservar button click', () => {
      const card = new ProfessionalCard(mockProfessional);
      card.mount(container);

      const html = container.innerHTML;
      expect(html).toContain(`dispatchEvent(new CustomEvent('book-service', { detail: { professionalId: '${mockProfessional.id}' } }))`);
    });
  });
});