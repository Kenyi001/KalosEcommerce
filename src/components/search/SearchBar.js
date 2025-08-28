import SearchService from '../../services/SearchService.js';

export default class SearchBar {
    constructor(container, options = {}) {
        this.container = typeof container === 'string' ? document.getElementById(container) : container;
        this.options = {
            placeholder: 'Buscar servicios, profesionales...',
            debounceTime: 300,
            maxSuggestions: 5,
            showRecentSearches: true,
            onSearch: null,
            onSuggestionSelect: null,
            ...options
        };
        
        this.currentQuery = '';
        this.suggestions = [];
        this.isOpen = false;
        this.selectedIndex = -1;
        this.debounceTimer = null;
        
        this.init();
        this.bindEvents();
    }

    init() {
        this.container.innerHTML = this.render();
        this.input = this.container.querySelector('.search-input');
        this.dropdown = this.container.querySelector('.search-dropdown');
        this.suggestionsContainer = this.container.querySelector('.suggestions-container');
    }

    render() {
        return `
            <div class="search-bar relative w-full">
                <div class="search-input-container relative">
                    <input 
                        type="text" 
                        class="search-input w-full px-4 py-3 pl-12 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                        placeholder="${this.options.placeholder}"
                        autocomplete="off"
                    >
                    <div class="search-icon absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                    <button class="clear-btn absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 hidden">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <div class="search-dropdown absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 hidden">
                    <div class="suggestions-container max-h-80 overflow-y-auto">
                        <!-- Suggestions will be inserted here -->
                    </div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        this.input.addEventListener('input', this.handleInput.bind(this));
        this.input.addEventListener('focus', this.handleFocus.bind(this));
        this.input.addEventListener('blur', this.handleBlur.bind(this));
        this.input.addEventListener('keydown', this.handleKeydown.bind(this));
        
        const clearBtn = this.container.querySelector('.clear-btn');
        clearBtn.addEventListener('click', this.clearSearch.bind(this));
        
        document.addEventListener('click', this.handleClickOutside.bind(this));
    }

    handleInput(e) {
        const query = e.target.value.trim();
        this.currentQuery = query;
        
        const clearBtn = this.container.querySelector('.clear-btn');
        if (query) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }
        
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.updateSuggestions(query);
        }, this.options.debounceTime);
    }

    handleFocus() {
        if (!this.currentQuery && this.options.showRecentSearches) {
            this.showRecentSearches();
        } else if (this.suggestions.length > 0) {
            this.showDropdown();
        }
    }

    handleBlur(e) {
        setTimeout(() => {
            if (!this.dropdown.contains(document.activeElement)) {
                this.hideDropdown();
            }
        }, 150);
    }

    handleKeydown(e) {
        if (!this.isOpen) return;
        
        const suggestionElements = this.suggestionsContainer.querySelectorAll('.suggestion-item');
        
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, suggestionElements.length - 1);
                this.updateSelection();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
                this.updateSelection();
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.selectedIndex >= 0 && suggestionElements[this.selectedIndex]) {
                    this.selectSuggestion(this.selectedIndex);
                } else {
                    this.performSearch(this.currentQuery);
                }
                break;
                
            case 'Escape':
                this.hideDropdown();
                this.input.blur();
                break;
        }
    }

    handleClickOutside(e) {
        if (!this.container.contains(e.target)) {
            this.hideDropdown();
        }
    }

    async updateSuggestions(query) {
        if (!query) {
            if (this.options.showRecentSearches) {
                this.showRecentSearches();
            } else {
                this.hideDropdown();
            }
            return;
        }

        try {
            const suggestions = await SearchService.getSuggestions(query);
            this.suggestions = suggestions;
            this.renderSuggestions();
            this.showDropdown();
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            this.hideDropdown();
        }
    }

    async showRecentSearches() {
        try {
            const recentSearches = await SearchService.getRecentSearches();
            if (recentSearches.length > 0) {
                this.renderRecentSearches(recentSearches);
                this.showDropdown();
            }
        } catch (error) {
            console.error('Error fetching recent searches:', error);
        }
    }

    renderSuggestions() {
        const suggestionsHTML = this.suggestions.map((suggestion, index) => `
            <div class="suggestion-item px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-3" data-index="${index}">
                <div class="suggestion-icon text-gray-400">
                    ${this.getSuggestionIcon(suggestion.type)}
                </div>
                <div class="flex-1">
                    <div class="suggestion-text text-gray-900">
                        ${this.highlightQuery(suggestion.text, this.currentQuery)}
                    </div>
                    ${suggestion.subtitle ? `
                        <div class="suggestion-subtitle text-sm text-gray-500 mt-1">
                            ${suggestion.subtitle}
                        </div>
                    ` : ''}
                </div>
                ${suggestion.trending ? `
                    <div class="trending-badge text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded">
                        Tendencia
                    </div>
                ` : ''}
            </div>
        `).join('');

        this.suggestionsContainer.innerHTML = suggestionsHTML;
        this.bindSuggestionEvents();
    }

    renderRecentSearches(recentSearches) {
        const recentHTML = `
            <div class="recent-searches-header px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                Búsquedas Recientes
            </div>
            ${recentSearches.map((search, index) => `
                <div class="suggestion-item px-4 py-3 hover:bg-gray-50 cursor-pointer flex items-center space-x-3" data-index="${index}" data-type="recent">
                    <div class="suggestion-icon text-gray-400">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <div class="suggestion-text text-gray-700">${search}</div>
                    </div>
                    <button class="remove-recent text-gray-300 hover:text-gray-500" data-search="${search}">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            `).join('')}
        `;

        this.suggestionsContainer.innerHTML = recentHTML;
        this.bindSuggestionEvents();
        this.bindRecentSearchEvents();
    }

    bindSuggestionEvents() {
        const suggestionItems = this.suggestionsContainer.querySelectorAll('.suggestion-item');
        suggestionItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectSuggestion(index);
            });
        });
    }

    bindRecentSearchEvents() {
        const removeButtons = this.suggestionsContainer.querySelectorAll('.remove-recent');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const searchTerm = btn.dataset.search;
                SearchService.removeFromRecentSearches(searchTerm);
                this.showRecentSearches(); // Refresh the list
            });
        });
    }

    selectSuggestion(index) {
        let selectedText;
        const isRecent = this.suggestionsContainer.querySelector(`[data-index="${index}"]`)?.dataset.type === 'recent';
        
        if (isRecent) {
            const recentSearches = SearchService.getRecentSearches();
            selectedText = recentSearches[index];
        } else {
            selectedText = this.suggestions[index]?.text || this.suggestions[index];
        }
        
        if (selectedText) {
            this.input.value = selectedText;
            this.currentQuery = selectedText;
            this.hideDropdown();
            
            if (this.options.onSuggestionSelect) {
                this.options.onSuggestionSelect(selectedText, this.suggestions[index]);
            }
            
            this.performSearch(selectedText);
        }
    }

    updateSelection() {
        const suggestionItems = this.suggestionsContainer.querySelectorAll('.suggestion-item');
        suggestionItems.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.classList.add('bg-primary-50', 'border-primary-200');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('bg-primary-50', 'border-primary-200');
            }
        });
    }

    getSuggestionIcon(type) {
        const icons = {
            service: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6z"></path>
                      </svg>`,
            professional: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>`,
            category: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14-7H5m14 14H5"></path>
                      </svg>`,
            location: `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>`
        };
        return icons[type] || icons.service;
    }

    highlightQuery(text, query) {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-800">$1</mark>');
    }

    showDropdown() {
        this.dropdown.classList.remove('hidden');
        this.isOpen = true;
        this.selectedIndex = -1;
    }

    hideDropdown() {
        this.dropdown.classList.add('hidden');
        this.isOpen = false;
        this.selectedIndex = -1;
    }

    clearSearch() {
        this.input.value = '';
        this.currentQuery = '';
        this.hideDropdown();
        this.container.querySelector('.clear-btn').classList.add('hidden');
        this.input.focus();
    }

    performSearch(query) {
        if (!query) return;
        
        SearchService.addToRecentSearches(query);
        
        if (this.options.onSearch) {
            this.options.onSearch(query);
        }
        
        this.hideDropdown();
    }

    setValue(value) {
        this.input.value = value;
        this.currentQuery = value;
        const clearBtn = this.container.querySelector('.clear-btn');
        if (value) {
            clearBtn.classList.remove('hidden');
        } else {
            clearBtn.classList.add('hidden');
        }
    }

    getValue() {
        return this.currentQuery;
    }

    focus() {
        this.input.focus();
    }

    destroy() {
        clearTimeout(this.debounceTimer);
        document.removeEventListener('click', this.handleClickOutside);
        this.container.innerHTML = '';
    }
}