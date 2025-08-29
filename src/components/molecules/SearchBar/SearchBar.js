/**
 * SearchBar Component - Kalos Design System
 * Advanced search with filters and suggestions
 */

import { BaseComponent } from '../../BaseComponent.js';
import { renderIcon } from '../../atoms/Icon/Icon.js';

export class SearchBar extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      placeholder: 'Buscar...',
      value: '',
      size: 'md',                // sm, md, lg
      variant: 'default',        // default, minimal, bordered
      showFilters: false,
      filters: [],               // Array of filter objects
      suggestions: [],           // Array of suggestion strings
      showSuggestions: true,
      maxSuggestions: 5,
      debounceMs: 300,          // Debounce search input
      minSearchLength: 2,       // Minimum chars to trigger search
      clearable: true,
      loading: false,
      disabled: false,
      onSearch: () => {},       // Called on search submit
      onChange: () => {},       // Called on input change
      onFilterChange: () => {}, // Called when filters change
      onClear: () => {},
      onSuggestionSelect: () => {},
      className: '',
      ...props
    };

    this.state = {
      value: this.props.value,
      showSuggestions: false,
      showFilters: false,
      selectedFilters: {},
      focusedSuggestion: -1,
      loading: this.props.loading
    };

    this.searchTimeout = null;
  }

  render() {
    const { 
      placeholder, 
      size, 
      variant, 
      showFilters, 
      filters,
      suggestions,
      clearable, 
      disabled, 
      className 
    } = this.props;

    const { 
      value, 
      showSuggestions, 
      showFilters: filtersVisible, 
      loading 
    } = this.state;

    const containerClasses = [
      'search-bar-container',
      `search-bar-${size}`,
      `search-bar-${variant}`,
      disabled ? 'search-bar-disabled' : '',
      className
    ].filter(Boolean).join(' ');

    return `
      <div class="${containerClasses}" data-component="search-bar">
        <!-- Main search input -->
        <div class="search-bar-input-wrapper">
          <div class="search-bar-icon">
            ${loading ? `
              <div class="search-bar-spinner">
                ${this.renderSpinner()}
              </div>
            ` : `
              ${renderIcon('search', { size: '16' })}
            `}
          </div>
          
          <input
            type="text"
            class="search-bar-input"
            placeholder="${placeholder}"
            value="${value}"
            ${disabled ? 'disabled' : ''}
          />
          
          <div class="search-bar-actions">
            ${clearable && value ? `
              <button class="search-bar-clear" type="button" aria-label="Limpiar búsqueda">
                ${renderIcon('x', { size: '16' })}
              </button>
            ` : ''}
            
            ${showFilters && filters.length > 0 ? `
              <button class="search-bar-filter-toggle ${filtersVisible ? 'active' : ''}" type="button" aria-label="Mostrar filtros">
                ${renderIcon('filter', { size: '16' })}
              </button>
            ` : ''}
          </div>
        </div>
        
        <!-- Suggestions dropdown -->
        ${showSuggestions && suggestions.length > 0 ? `
          <div class="search-bar-suggestions">
            <div class="search-suggestions-list">
              ${this.renderSuggestions()}
            </div>
          </div>
        ` : ''}
        
        <!-- Filters panel -->
        ${showFilters && filtersVisible ? `
          <div class="search-bar-filters">
            <div class="search-filters-header">
              <h4>Filtros</h4>
              <button class="search-filters-clear" type="button">Limpiar todo</button>
            </div>
            <div class="search-filters-content">
              ${this.renderFilters()}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  renderSpinner() {
    return `
      <svg class="spinner" viewBox="0 0 24 24" fill="none">
        <circle class="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
        <circle class="spinner-head" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416" />
      </svg>
    `;
  }

  renderSuggestions() {
    const { suggestions, maxSuggestions } = this.props;
    const { focusedSuggestion } = this.state;
    
    return suggestions
      .slice(0, maxSuggestions)
      .map((suggestion, index) => `
        <div 
          class="search-suggestion ${index === focusedSuggestion ? 'focused' : ''}"
          data-suggestion="${suggestion}"
        >
          <div class="search-suggestion-icon">
            ${renderIcon('search', { size: '14' })}
          </div>
          <span class="search-suggestion-text">${suggestion}</span>
        </div>
      `).join('');
  }

  renderFilters() {
    const { filters } = this.props;
    const { selectedFilters } = this.state;

    return filters.map(filter => {
      switch (filter.type) {
        case 'select':
          return this.renderSelectFilter(filter, selectedFilters[filter.key]);
        case 'checkbox':
          return this.renderCheckboxFilter(filter, selectedFilters[filter.key]);
        case 'range':
          return this.renderRangeFilter(filter, selectedFilters[filter.key]);
        case 'radio':
          return this.renderRadioFilter(filter, selectedFilters[filter.key]);
        default:
          return '';
      }
    }).join('');
  }

  renderSelectFilter(filter, value) {
    return `
      <div class="search-filter search-filter-select">
        <label class="search-filter-label">${filter.label}</label>
        <select class="search-filter-control" data-filter="${filter.key}">
          <option value="">Todos</option>
          ${filter.options.map(option => `
            <option value="${option.value}" ${value === option.value ? 'selected' : ''}>
              ${option.label}
            </option>
          `).join('')}
        </select>
      </div>
    `;
  }

  renderCheckboxFilter(filter, values = []) {
    return `
      <div class="search-filter search-filter-checkbox">
        <label class="search-filter-label">${filter.label}</label>
        <div class="search-filter-options">
          ${filter.options.map(option => `
            <label class="search-checkbox-option">
              <input 
                type="checkbox" 
                value="${option.value}"
                data-filter="${filter.key}"
                ${values.includes(option.value) ? 'checked' : ''}
              />
              <span class="search-checkbox-label">${option.label}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderRadioFilter(filter, value) {
    return `
      <div class="search-filter search-filter-radio">
        <label class="search-filter-label">${filter.label}</label>
        <div class="search-filter-options">
          ${filter.options.map(option => `
            <label class="search-radio-option">
              <input 
                type="radio" 
                name="filter-${filter.key}"
                value="${option.value}"
                data-filter="${filter.key}"
                ${value === option.value ? 'checked' : ''}
              />
              <span class="search-radio-label">${option.label}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderRangeFilter(filter, value = {}) {
    return `
      <div class="search-filter search-filter-range">
        <label class="search-filter-label">${filter.label}</label>
        <div class="search-range-inputs">
          <input 
            type="number" 
            class="search-range-input"
            placeholder="Mín"
            value="${value.min || ''}"
            data-filter="${filter.key}"
            data-range="min"
            ${filter.min !== undefined ? `min="${filter.min}"` : ''}
            ${filter.max !== undefined ? `max="${filter.max}"` : ''}
          />
          <span class="search-range-separator">-</span>
          <input 
            type="number" 
            class="search-range-input"
            placeholder="Máx"
            value="${value.max || ''}"
            data-filter="${filter.key}"
            data-range="max"
            ${filter.min !== undefined ? `min="${filter.min}"` : ''}
            ${filter.max !== undefined ? `max="${filter.max}"` : ''}
          />
        </div>
      </div>
    `;
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="search-bar"]';
    this.input = this.element.querySelector('.search-bar-input');
    
    // Focus input
    if (this.input && !this.props.disabled) {
      this.input.focus();
    }
  }

  bindEvents() {
    if (!this.input) return;

    // Input events
    this.addEventListener(this.input, 'input', (e) => {
      const value = e.target.value;
      this.handleInputChange(value);
    });

    this.addEventListener(this.input, 'keydown', (e) => {
      this.handleKeydown(e);
    });

    this.addEventListener(this.input, 'focus', () => {
      if (this.props.suggestions.length > 0) {
        this.setState({ showSuggestions: true });
      }
    });

    // Clear button
    const clearBtn = this.element.querySelector('.search-bar-clear');
    if (clearBtn) {
      this.addEventListener(clearBtn, 'click', () => {
        this.clear();
      });
    }

    // Filter toggle
    const filterToggle = this.element.querySelector('.search-bar-filter-toggle');
    if (filterToggle) {
      this.addEventListener(filterToggle, 'click', () => {
        this.toggleFilters();
      });
    }

    // Suggestion clicks
    const suggestions = this.element.querySelectorAll('.search-suggestion');
    suggestions.forEach(suggestion => {
      this.addEventListener(suggestion, 'click', () => {
        const text = suggestion.dataset.suggestion;
        this.selectSuggestion(text);
      });
    });

    // Filter changes
    this.bindFilterEvents();

    // Click outside to close
    this.addEventListener(document, 'click', (e) => {
      if (!this.element.contains(e.target)) {
        this.setState({ 
          showSuggestions: false,
          showFilters: false 
        });
      }
    });
  }

  bindFilterEvents() {
    // Select filters
    const selects = this.element.querySelectorAll('.search-filter-control');
    selects.forEach(select => {
      this.addEventListener(select, 'change', (e) => {
        const filterKey = e.target.dataset.filter;
        const value = e.target.value;
        this.updateFilter(filterKey, value);
      });
    });

    // Checkbox filters
    const checkboxes = this.element.querySelectorAll('input[type="checkbox"][data-filter]');
    checkboxes.forEach(checkbox => {
      this.addEventListener(checkbox, 'change', (e) => {
        const filterKey = e.target.dataset.filter;
        const value = e.target.value;
        const checked = e.target.checked;
        this.updateCheckboxFilter(filterKey, value, checked);
      });
    });

    // Radio filters
    const radios = this.element.querySelectorAll('input[type="radio"][data-filter]');
    radios.forEach(radio => {
      this.addEventListener(radio, 'change', (e) => {
        const filterKey = e.target.dataset.filter;
        const value = e.target.value;
        this.updateFilter(filterKey, value);
      });
    });

    // Range filters
    const rangeInputs = this.element.querySelectorAll('.search-range-input');
    rangeInputs.forEach(input => {
      this.addEventListener(input, 'input', (e) => {
        const filterKey = e.target.dataset.filter;
        const rangeType = e.target.dataset.range;
        const value = e.target.value;
        this.updateRangeFilter(filterKey, rangeType, value);
      });
    });

    // Clear filters
    const clearFilters = this.element.querySelector('.search-filters-clear');
    if (clearFilters) {
      this.addEventListener(clearFilters, 'click', () => {
        this.clearFilters();
      });
    }
  }

  handleInputChange(value) {
    this.setState({ value });

    if (this.props.onChange) {
      this.props.onChange(value);
    }

    // Debounced search
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.searchTimeout = setTimeout(() => {
      if (value.length >= this.props.minSearchLength) {
        this.performSearch(value);
      }
    }, this.props.debounceMs);
  }

  handleKeydown(e) {
    const { showSuggestions, focusedSuggestion } = this.state;
    const { suggestions } = this.props;

    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.performSearch(this.state.value);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.setState({ 
          focusedSuggestion: Math.min(focusedSuggestion + 1, suggestions.length - 1) 
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.setState({ 
          focusedSuggestion: Math.max(focusedSuggestion - 1, -1) 
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedSuggestion >= 0) {
          this.selectSuggestion(suggestions[focusedSuggestion]);
        } else {
          this.performSearch(this.state.value);
        }
        break;
      case 'Escape':
        this.setState({ 
          showSuggestions: false,
          focusedSuggestion: -1 
        });
        break;
    }
  }

  selectSuggestion(suggestion) {
    this.setState({ 
      value: suggestion, 
      showSuggestions: false,
      focusedSuggestion: -1 
    });

    if (this.props.onSuggestionSelect) {
      this.props.onSuggestionSelect(suggestion);
    }

    this.performSearch(suggestion);
  }

  performSearch(query) {
    if (this.props.onSearch) {
      this.props.onSearch(query, this.state.selectedFilters);
    }
  }

  updateFilter(filterKey, value) {
    const selectedFilters = { 
      ...this.state.selectedFilters, 
      [filterKey]: value 
    };
    
    this.setState({ selectedFilters });

    if (this.props.onFilterChange) {
      this.props.onFilterChange(selectedFilters);
    }
  }

  updateCheckboxFilter(filterKey, value, checked) {
    const currentValues = this.state.selectedFilters[filterKey] || [];
    let newValues;

    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }

    const selectedFilters = { 
      ...this.state.selectedFilters, 
      [filterKey]: newValues 
    };
    
    this.setState({ selectedFilters });

    if (this.props.onFilterChange) {
      this.props.onFilterChange(selectedFilters);
    }
  }

  updateRangeFilter(filterKey, rangeType, value) {
    const currentRange = this.state.selectedFilters[filterKey] || {};
    const selectedFilters = { 
      ...this.state.selectedFilters, 
      [filterKey]: { ...currentRange, [rangeType]: value } 
    };
    
    this.setState({ selectedFilters });

    if (this.props.onFilterChange) {
      this.props.onFilterChange(selectedFilters);
    }
  }

  toggleFilters() {
    this.setState({ showFilters: !this.state.showFilters });
  }

  clear() {
    this.setState({ value: '', showSuggestions: false });
    
    if (this.input) {
      this.input.value = '';
      this.input.focus();
    }

    if (this.props.onClear) {
      this.props.onClear();
    }
  }

  clearFilters() {
    this.setState({ selectedFilters: {} });

    if (this.props.onFilterChange) {
      this.props.onFilterChange({});
    }
  }

  // Public methods
  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  getValue() {
    return this.state.value;
  }

  setValue(value) {
    this.setState({ value });
    if (this.input) {
      this.input.value = value;
    }
  }

  getFilters() {
    return this.state.selectedFilters;
  }

  setFilters(filters) {
    this.setState({ selectedFilters: filters });
  }

  setLoading(loading) {
    this.setState({ loading });
  }
}

// Factory function
export function createSearchBar(props) {
  return new SearchBar(props);
}