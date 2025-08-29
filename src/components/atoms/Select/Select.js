/**
 * Select Component - Kalos Design System
 * Dropdown select with search and multi-select capabilities
 */

import { BaseComponent } from '../../BaseComponent.js';
import { renderIcon } from '../Icon/Icon.js';

export class Select extends BaseComponent {
  constructor(props = {}) {
    super(null, props);
    
    this.props = {
      name: '',
      placeholder: 'Seleccionar...',
      value: '',
      options: [],           // Array of { value, label, disabled? }
      multiple: false,
      searchable: false,
      clearable: false,
      disabled: false,
      required: false,
      size: 'md',           // sm, md, lg
      variant: 'default',   // default, bordered
      error: '',
      maxHeight: 200,       // Max height for dropdown
      onChange: () => {},
      onSearch: null,       // For async searching
      className: '',
      ...props
    };

    this.state = {
      isOpen: false,
      searchTerm: '',
      selectedValues: this.props.multiple 
        ? (Array.isArray(this.props.value) ? this.props.value : [])
        : this.props.value,
      focusedIndex: -1
    };
  }

  render() {
    const { 
      name, 
      placeholder, 
      multiple, 
      searchable, 
      clearable, 
      disabled, 
      required,
      size, 
      variant, 
      error, 
      className 
    } = this.props;

    const { isOpen, selectedValues, searchTerm } = this.state;
    const hasError = !!error;
    const hasValue = multiple ? selectedValues.length > 0 : !!selectedValues;

    const selectClasses = [
      'select-container',
      `select-${size}`,
      `select-${variant}`,
      isOpen ? 'select-open' : '',
      disabled ? 'select-disabled' : '',
      hasError ? 'select-error' : '',
      className
    ].filter(Boolean).join(' ');

    return `
      <div class="${selectClasses}" data-component="select">
        <!-- Hidden input for form submission -->
        <input 
          type="hidden" 
          name="${name}" 
          value="${multiple ? selectedValues.join(',') : selectedValues}"
          ${required ? 'required' : ''}
        />
        
        <!-- Select trigger -->
        <div class="select-trigger" tabindex="${disabled ? -1 : 0}">
          <div class="select-value">
            ${hasValue ? this.renderSelectedValue() : `
              <span class="select-placeholder">${placeholder}</span>
            `}
          </div>
          
          <div class="select-icons">
            ${clearable && hasValue && !disabled ? `
              <button class="select-clear" type="button" aria-label="Limpiar selección">
                ${renderIcon('x', { size: '16' })}
              </button>
            ` : ''}
            
            <div class="select-chevron ${isOpen ? 'select-chevron-up' : 'select-chevron-down'}">
              ${renderIcon('chevron-down', { size: '16' })}
            </div>
          </div>
        </div>
        
        <!-- Dropdown -->
        ${isOpen ? `
          <div class="select-dropdown" style="max-height: ${this.props.maxHeight}px">
            ${searchable ? `
              <div class="select-search">
                <div class="select-search-input">
                  ${renderIcon('search', { size: '16', className: 'select-search-icon' })}
                  <input 
                    type="text" 
                    placeholder="Buscar..." 
                    value="${searchTerm}"
                    class="select-search-field"
                  />
                </div>
              </div>
            ` : ''}
            
            <div class="select-options">
              ${this.renderOptions()}
            </div>
          </div>
        ` : ''}
        
        ${hasError ? `
          <div class="select-error-message" role="alert">
            ${error}
          </div>
        ` : ''}
      </div>
    `;
  }

  renderSelectedValue() {
    const { multiple, options } = this.props;
    const { selectedValues } = this.state;

    if (multiple && Array.isArray(selectedValues)) {
      if (selectedValues.length === 0) return '';
      
      if (selectedValues.length === 1) {
        const option = options.find(opt => opt.value === selectedValues[0]);
        return option ? option.label : selectedValues[0];
      }
      
      return `
        <div class="select-multi-values">
          ${selectedValues.slice(0, 2).map(value => {
            const option = options.find(opt => opt.value === value);
            return `
              <span class="select-tag">
                ${option ? option.label : value}
                <button class="select-tag-remove" data-value="${value}">
                  ${renderIcon('x', { size: '12' })}
                </button>
              </span>
            `;
          }).join('')}
          ${selectedValues.length > 2 ? `
            <span class="select-tag select-tag-count">
              +${selectedValues.length - 2} más
            </span>
          ` : ''}
        </div>
      `;
    } else {
      const option = options.find(opt => opt.value === selectedValues);
      return option ? option.label : selectedValues;
    }
  }

  renderOptions() {
    const { options, multiple } = this.props;
    const { searchTerm, selectedValues, focusedIndex } = this.state;
    
    const filteredOptions = searchTerm 
      ? options.filter(option => 
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;

    if (filteredOptions.length === 0) {
      return `
        <div class="select-no-options">
          ${searchTerm ? 'No se encontraron resultados' : 'No hay opciones disponibles'}
        </div>
      `;
    }

    return filteredOptions.map((option, index) => {
      const isSelected = multiple 
        ? selectedValues.includes(option.value)
        : selectedValues === option.value;
      const isFocused = index === focusedIndex;

      return `
        <div 
          class="select-option ${isSelected ? 'select-option-selected' : ''} ${isFocused ? 'select-option-focused' : ''} ${option.disabled ? 'select-option-disabled' : ''}"
          data-value="${option.value}"
          role="option"
          aria-selected="${isSelected}"
        >
          ${multiple ? `
            <div class="select-checkbox ${isSelected ? 'select-checkbox-checked' : ''}">
              ${isSelected ? renderIcon('check', { size: '14' }) : ''}
            </div>
          ` : ''}
          
          <span class="select-option-label">${option.label}</span>
          
          ${!multiple && isSelected ? `
            <div class="select-option-check">
              ${renderIcon('check', { size: '16' })}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  afterMount() {
    super.afterMount();
    this.selector = '[data-component="select"]';
    this.trigger = this.element.querySelector('.select-trigger');
    this.dropdown = null;
    this.searchInput = null;
  }

  bindEvents() {
    // Trigger click
    if (this.trigger) {
      this.addEventListener(this.trigger, 'click', (e) => {
        e.preventDefault();
        if (!this.props.disabled) {
          this.toggle();
        }
      });

      // Keyboard navigation on trigger
      this.addEventListener(this.trigger, 'keydown', (e) => {
        this.handleTriggerKeydown(e);
      });
    }

    // Clear button
    const clearBtn = this.element.querySelector('.select-clear');
    if (clearBtn) {
      this.addEventListener(clearBtn, 'click', (e) => {
        e.stopPropagation();
        this.clear();
      });
    }

    // Close on outside click
    this.addEventListener(document, 'click', (e) => {
      if (!this.element.contains(e.target)) {
        this.close();
      }
    });

    // Tag remove buttons (for multiple)
    const tagRemoveBtns = this.element.querySelectorAll('.select-tag-remove');
    tagRemoveBtns.forEach(btn => {
      this.addEventListener(btn, 'click', (e) => {
        e.stopPropagation();
        const value = btn.dataset.value;
        this.removeValue(value);
      });
    });

    this.bindDropdownEvents();
  }

  bindDropdownEvents() {
    if (!this.state.isOpen) return;

    this.dropdown = this.element.querySelector('.select-dropdown');
    this.searchInput = this.element.querySelector('.select-search-field');

    if (this.searchInput) {
      this.addEventListener(this.searchInput, 'input', (e) => {
        const searchTerm = e.target.value;
        this.setState({ searchTerm, focusedIndex: 0 });
        
        if (this.props.onSearch) {
          this.props.onSearch(searchTerm);
        }
      });

      this.addEventListener(this.searchInput, 'keydown', (e) => {
        this.handleSearchKeydown(e);
      });

      // Focus search input when opened
      setTimeout(() => {
        if (this.searchInput) {
          this.searchInput.focus();
        }
      }, 0);
    }

    // Option clicks
    const options = this.element.querySelectorAll('.select-option:not(.select-option-disabled)');
    options.forEach((option, index) => {
      this.addEventListener(option, 'click', () => {
        const value = option.dataset.value;
        this.selectValue(value);
      });
    });
  }

  handleTriggerKeydown(e) {
    const { isOpen } = this.state;

    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          this.open();
        } else {
          this.moveFocus(e.key === 'ArrowDown' ? 1 : -1);
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          this.open();
        } else {
          this.selectFocusedOption();
        }
        break;
      case 'Escape':
        if (isOpen) {
          e.preventDefault();
          this.close();
        }
        break;
    }
  }

  handleSearchKeydown(e) {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        e.preventDefault();
        this.moveFocus(e.key === 'ArrowDown' ? 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        this.selectFocusedOption();
        break;
      case 'Escape':
        e.preventDefault();
        this.close();
        break;
    }
  }

  moveFocus(direction) {
    const options = this.getFilteredOptions();
    const { focusedIndex } = this.state;
    let newIndex = focusedIndex + direction;

    if (newIndex < 0) {
      newIndex = options.length - 1;
    } else if (newIndex >= options.length) {
      newIndex = 0;
    }

    this.setState({ focusedIndex: newIndex });
  }

  selectFocusedOption() {
    const options = this.getFilteredOptions();
    const { focusedIndex } = this.state;
    
    if (focusedIndex >= 0 && focusedIndex < options.length) {
      const option = options[focusedIndex];
      this.selectValue(option.value);
    }
  }

  getFilteredOptions() {
    const { options } = this.props;
    const { searchTerm } = this.state;
    
    return searchTerm 
      ? options.filter(option => 
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : options;
  }

  selectValue(value) {
    const { multiple } = this.props;
    let newSelectedValues;

    if (multiple) {
      const currentValues = Array.isArray(this.state.selectedValues) 
        ? this.state.selectedValues 
        : [];
      
      if (currentValues.includes(value)) {
        newSelectedValues = currentValues.filter(v => v !== value);
      } else {
        newSelectedValues = [...currentValues, value];
      }
    } else {
      newSelectedValues = value;
      this.close();
    }

    this.setState({ selectedValues: newSelectedValues });
    
    if (this.props.onChange) {
      this.props.onChange(newSelectedValues);
    }
  }

  removeValue(value) {
    const currentValues = Array.isArray(this.state.selectedValues) 
      ? this.state.selectedValues 
      : [];
    
    const newSelectedValues = currentValues.filter(v => v !== value);
    this.setState({ selectedValues: newSelectedValues });
    
    if (this.props.onChange) {
      this.props.onChange(newSelectedValues);
    }
  }

  clear() {
    const newSelectedValues = this.props.multiple ? [] : '';
    this.setState({ selectedValues: newSelectedValues });
    
    if (this.props.onChange) {
      this.props.onChange(newSelectedValues);
    }
  }

  open() {
    if (!this.props.disabled) {
      this.setState({ 
        isOpen: true, 
        focusedIndex: -1,
        searchTerm: this.props.searchable ? this.state.searchTerm : ''
      });
    }
  }

  close() {
    this.setState({ 
      isOpen: false, 
      focusedIndex: -1,
      searchTerm: ''
    });
    
    if (this.trigger) {
      this.trigger.focus();
    }
  }

  toggle() {
    if (this.state.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  // Public methods
  getValue() {
    return this.state.selectedValues;
  }

  setValue(value) {
    this.setState({ selectedValues: value });
  }

  setOptions(options) {
    this.props.options = options;
    this.rerender();
  }
}

// Factory function
export function createSelect(props) {
  return new Select(props);
}