import { ComponentItem } from '../data/sampleComponents';

interface ListOptions {
  valueNames: (string | { name: string; attr: string })[];
  item?: string;
  listClass?: string;
  searchClass?: string;
  sortClass?: string;
  indexAsync?: boolean;
  page?: number;
  pagination?: boolean;
}

interface ListInstance {
  search: (searchString: string, columns?: string[]) => void;
  fuzzySearch: (searchString: string) => void;
  filter: (filterFunction: (item: any) => boolean) => void;
  sort: (sortName: string, options: { order: 'asc' | 'desc' }) => void;
  show: (i: number, page: number) => void;
  update: () => void;
  on: (event: string, callback: () => void) => void;
  matchingItems: any[];
}

// Initialize List.js for component filtering and searching
export function initComponentList(
  listContainerId: string,
  components: ComponentItem[],
  options?: Partial<ListOptions>
): ListInstance | null {
  if (typeof window === 'undefined') return null;
  
  // Dynamically import List.js
  const List = require('list.js');
  
  const defaultOptions: ListOptions = {
    valueNames: [
      'component-title', 
      'component-description', 
      { name: 'component-category', attr: 'data-category' },
      { name: 'component-tags', attr: 'data-tags' }
    ],
    listClass: 'components-grid',
    searchClass: 'search-field',
    sortClass: 'sort',
    indexAsync: true,
    page: 10,
    pagination: true
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  try {
    // Map component data to the format expected by List.js
    const values = components.map(component => ({
      'component-title': component.title,
      'component-description': component.description,
      'component-category': component.category,
      'component-tags': component.tags.join(','),
      'component-slug': component.slug,
      'component-image': component.image
    }));
    
    // Initialize List.js with the container ID, options, and values
    const list = new List(listContainerId, mergedOptions, values);
    
    // Add custom event handlers
    list.on('updated', function() {
      // Add animations to items when list is updated
      if (typeof window !== 'undefined' && window.gsap) {
        const items = document.querySelectorAll(`#${listContainerId} .component-item`);
        window.gsap.fromTo(
          items, 
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.6, 
            stagger: 0.05,
            ease: 'cubic-default'
          }
        );
      }
    });
    
    return list;
  } catch (error) {
    console.error('Error initializing List.js:', error);
    return null;
  }
}

// Filter components by category
export function filterByCategory(list: ListInstance, category: string): void {
  if (!list) return;
  
  if (category === 'all') {
    list.filter(() => true); // Show all items
  } else {
    list.filter((item: any) => {
      const itemCategory = item.values()['component-category'];
      return itemCategory.toLowerCase() === category.toLowerCase();
    });
  }
}

// Filter components by tag
export function filterByTag(list: ListInstance, tag: string): void {
  if (!list) return;
  
  list.filter((item: any) => {
    const itemTags = item.values()['component-tags'].split(',');
    return itemTags.some((t: string) => t.toLowerCase() === tag.toLowerCase());
  });
}

// Search components
export function searchComponents(list: ListInstance, query: string): void {
  if (!list) return;
  
  if (query.trim() === '') {
    list.filter(() => true); // Show all items if query is empty
  } else {
    list.fuzzySearch(query);
  }
}

// Sort components
export function sortComponents(list: ListInstance, sortBy: string, order: 'asc' | 'desc' = 'asc'): void {
  if (!list) return;
  
  list.sort(sortBy, { order });
}

// Reset all filters and search
export function resetFilters(list: ListInstance): void {
  if (!list) return;
  
  list.filter(() => true);
  list.search('');
  list.sort('component-title', { order: 'asc' });
}
