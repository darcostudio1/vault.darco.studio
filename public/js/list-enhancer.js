/**
 * List.js Enhancer
 * Adds additional functionality to List.js for better filtering, sorting, and UI interactions
 */

// Check if we're in a browser environment before executing
if (typeof window !== 'undefined') {
  class ListEnhancer {
    constructor(listInstance, options = {}) {
      if (!listInstance) {
        console.warn('List.js instance not provided to ListEnhancer');
        return;
      }
      
      this.list = listInstance;
      this.options = Object.assign({
        emptyMessageSelector: '.empty-message',
        filterDropdownSelector: '.filter-dropdown',
        filterToggleSelector: '.filter-toggle',
        activeFiltersSelector: '.active-filters',
        clearFiltersSelector: '.clear-filters',
        sortButtonSelector: '.sort-button',
        animationDuration: 300, // ms
      }, options);
      
      this.init();
    }
    
    init() {
      this.setupEmptyMessage();
      this.setupFilterDropdowns();
      this.setupSortButtons();
      this.setupActiveFilters();
      
      // Update UI on initial load
      this.updateUI();
      
      // Listen for List.js events
      this.list.on('searchStart', this.updateUI.bind(this));
      this.list.on('searchComplete', this.updateUI.bind(this));
      this.list.on('filterStart', this.updateUI.bind(this));
      this.list.on('filterComplete', this.updateUI.bind(this));
      this.list.on('sortStart', this.updateUI.bind(this));
      this.list.on('sortComplete', this.updateUI.bind(this));
    }
    
    setupEmptyMessage() {
      this.emptyMessage = document.querySelector(this.options.emptyMessageSelector);
      if (!this.emptyMessage) return;
      
      // Create a mutation observer to watch for changes in the list
      const observer = new MutationObserver((mutations) => {
        this.updateEmptyMessage();
      });
      
      // Start observing the list element
      observer.observe(this.list.list, { 
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    }
    
    updateEmptyMessage() {
      if (!this.emptyMessage) return;
      
      // Check if any items are visible
      const visibleItems = this.list.visibleItems.length;
      
      if (visibleItems === 0) {
        this.emptyMessage.classList.add('visible');
      } else {
        this.emptyMessage.classList.remove('visible');
      }
    }
    
    setupFilterDropdowns() {
      const toggles = document.querySelectorAll(this.options.filterToggleSelector);
      const dropdowns = document.querySelectorAll(this.options.filterDropdownSelector);
      
      toggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = toggle.getAttribute('data-target');
          if (!targetId) return;
          
          const dropdown = document.getElementById(targetId);
          
          if (dropdown) {
            // Close all other dropdowns
            dropdowns.forEach(d => {
              if (d.id !== targetId) {
                d.classList.remove('open');
              }
            });
            
            // Toggle this dropdown
            dropdown.classList.toggle('open');
          }
        });
      });
      
      // Close dropdowns when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest(this.options.filterDropdownSelector) && 
            !e.target.closest(this.options.filterToggleSelector)) {
          dropdowns.forEach(dropdown => {
            dropdown.classList.remove('open');
          });
        }
      });
    }
    
    setupSortButtons() {
      const sortButtons = document.querySelectorAll(this.options.sortButtonSelector);
      
      sortButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          
          const sortValue = button.getAttribute('data-sort');
          if (!sortValue) return;
          
          const currentOrder = button.getAttribute('data-order') || 'asc';
          const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
          
          // Update button state
          sortButtons.forEach(btn => {
            btn.classList.remove('sort-asc', 'sort-desc');
            btn.setAttribute('data-order', 'asc');
          });
          
          button.classList.add(`sort-${newOrder}`);
          button.setAttribute('data-order', newOrder);
          
          // Sort the list
          this.list.sort(sortValue, { order: newOrder });
        });
      });
    }
    
    setupActiveFilters() {
      const clearFiltersButton = document.querySelector(this.options.clearFiltersSelector);
      
      if (clearFiltersButton) {
        clearFiltersButton.addEventListener('click', (e) => {
          e.preventDefault();
          
          // Reset all filters
          this.list.filter();
          this.list.search();
          
          // Update UI
          this.updateUI();
          
          // Clear any filter UI elements (checkboxes, etc.)
          document.querySelectorAll('input[type="checkbox"][data-filter]').forEach(checkbox => {
            checkbox.checked = false;
          });
          
          document.querySelectorAll('input[type="text"][data-search]').forEach(input => {
            input.value = '';
          });
        });
      }
    }
    
    updateUI() {
      this.updateEmptyMessage();
      
      // Add animation classes to items
      setTimeout(() => {
        if (!this.list || !this.list.items) return;
        
        this.list.items.forEach(item => {
          if (item.filtered || item.matching === false) {
            item.elm.classList.add('filtered-out');
          } else {
            item.elm.classList.remove('filtered-out');
          }
        });
      }, 0);
    }
    
    // Helper method to add a new filter
    addFilter(field, value, callback) {
      this.list.filter(item => {
        // Apply existing filters
        if (item.filtered) return false;
        
        // Apply new filter
        const itemValue = item.values()[field];
        return callback(itemValue, value);
      });
      
      this.updateUI();
    }
    
    // Helper method to clear all filters
    clearFilters() {
      this.list.filter();
      this.updateUI();
    }
  }

  // Make it available globally
  window.ListEnhancer = ListEnhancer;
} 