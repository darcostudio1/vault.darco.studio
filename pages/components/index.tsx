import { useState } from 'react';
import VaultLayout from '../../components/layout/VaultLayout';
import ComponentGrid, { ComponentItem } from '../../components/ComponentGrid';

// Sample component data
const sampleComponents: ComponentItem[] = [
  {
    id: '1',
    title: 'Animated Button',
    description: 'A customizable button component with smooth hover and click animations',
    image: '/samples/animated-button.gif',
    tags: ['UI', 'Animation', 'Interactive'],
    slug: 'animated-button',
    category: 'animation'
  },
  {
    id: '2',
    title: 'Card Grid Layout',
    description: 'Responsive grid layout for displaying cards with automatic sizing',
    image: '/samples/card-grid.png',
    tags: ['Layout', 'Grid', 'Responsive'],
    slug: 'card-grid-layout',
    category: 'layout'
  },
  {
    id: '3',
    title: 'Modal Dialog',
    description: 'Accessible modal dialog with customizable content and animations',
    image: '/samples/modal-dialog.png',
    tags: ['UI', 'Accessibility', 'Dialog'],
    slug: 'modal-dialog',
    category: 'interaction'
  },
  {
    id: '4',
    title: 'Parallax Scroll',
    description: 'Create engaging parallax scrolling effects with configurable layers',
    image: '/samples/parallax-scroll.gif',
    tags: ['Animation', 'Scroll', 'Effect'],
    slug: 'parallax-scroll',
    category: 'animation'
  },
  {
    id: '5',
    title: 'Tabbed Interface',
    description: 'Accessible tabbed interface with keyboard navigation support',
    image: '/samples/tabbed-interface.png',
    tags: ['UI', 'Navigation', 'Accessibility'],
    slug: 'tabbed-interface',
    category: 'interaction'
  },
  {
    id: '6',
    title: 'Image Gallery',
    description: 'Responsive image gallery with lightbox and thumbnail navigation',
    image: '/samples/image-gallery.png',
    tags: ['Gallery', 'Images', 'Lightbox'],
    slug: 'image-gallery',
    category: 'layout'
  },
  {
    id: '7',
    title: 'Tooltip Component',
    description: 'Customizable tooltip component with multiple positions and themes',
    image: '/samples/tooltip.png',
    tags: ['UI', 'Tooltip', 'Hover'],
    slug: 'tooltip-component',
    category: 'interaction'
  },
  {
    id: '8',
    title: 'Accordion Menu',
    description: 'Collapsible accordion menu with smooth animations and keyboard support',
    image: '/samples/accordion.png',
    tags: ['UI', 'Navigation', 'Menu'],
    slug: 'accordion-menu',
    category: 'interaction'
  },
  {
    id: '9',
    title: 'Form Elements',
    description: 'Styled form elements with validation and accessibility features',
    image: '/samples/form-elements.png',
    tags: ['UI', 'Form', 'Input'],
    slug: 'form-elements',
    category: 'ui'
  },
  {
    id: '10',
    title: 'Data Table',
    description: 'Responsive data table with sorting, filtering, and pagination',
    image: '/samples/data-table.png',
    tags: ['UI', 'Table', 'Data'],
    slug: 'data-table',
    category: 'ui'
  },
  {
    id: '11',
    title: 'Notification System',
    description: 'Toast notification system with different types and positions',
    image: '/samples/notification.png',
    tags: ['UI', 'Notification', 'Alert'],
    slug: 'notification-system',
    category: 'interaction'
  },
  {
    id: '12',
    title: 'Masonry Layout',
    description: 'Pinterest-style masonry layout for displaying content of varying heights',
    image: '/samples/masonry.png',
    tags: ['Layout', 'Grid', 'Responsive'],
    slug: 'masonry-layout',
    category: 'layout'
  }
];

export default function ComponentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Filter components based on search query and selected category
  const filteredComponents = sampleComponents.filter(component => {
    const matchesSearch = searchQuery === '' || 
      component.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || 
      component.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories
  const categories = Array.from(new Set(sampleComponents.map(comp => comp.category)));
  
  return (
    <VaultLayout title="Components — DARCO Vault">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Components</h1>
        <p className="text-secondary">
          Browse our collection of reusable components for your projects.
          Each component includes code, usage examples, and customization options.
        </p>
      </div>
      
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search components..."
              className="w-full px-4 py-2 pl-10 rounded-md border border-slate focus:outline-none focus:border-accent-color"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary">
              search
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            className={`px-3 py-2 rounded-md text-sm ${selectedCategory === null ? 'bg-accent-color text-white' : 'bg-slate'}`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          
          {categories.map(category => (
            <button
              key={category}
              className={`px-3 py-2 rounded-md text-sm ${selectedCategory === category ? 'bg-accent-color text-white' : 'bg-slate'}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Component grid */}
      <ComponentGrid 
        components={filteredComponents} 
        title={selectedCategory 
          ? `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Components` 
          : 'All Components'
        }
      />
    </VaultLayout>
  );
}
