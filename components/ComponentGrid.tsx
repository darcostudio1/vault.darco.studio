import React, { useEffect, useRef, useState } from 'react';
import ComponentCard from './ComponentCard';
import { Component } from '../types/Component';
import { staggerFadeIn } from '../utils/animations';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

interface ComponentGridProps {
  components: Component[];
  title?: string;
  category?: string;
  showFilters?: boolean;
}

const ComponentGrid: React.FC<ComponentGridProps> = ({ 
  components, 
  title, 
  category,
  showFilters = false
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(category || 'all');
  const [sortBy, setSortBy] = useState('newest');
  
  // Initialize with default sorting (newest first)
  useEffect(() => {
    if (!showFilters) {
      setActiveCategory('all');
      setSortBy('newest');
      setSearchTerm('');
    }
  }, [showFilters]);

  // Get unique categories from components
  const categories = ['all', ...Array.from(new Set(components.map(comp => comp.category)))];
  
  // Filter and sort components
  const filteredComponents = components
    .filter(comp => {
      // Filter by category
      if (activeCategory && activeCategory !== 'all') {
        if (comp.category !== activeCategory) return false;
      }
      
      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          comp.title.toLowerCase().includes(searchLower) || 
          comp.description.toLowerCase().includes(searchLower) ||
          (comp.tags && comp.tags.some(tag => tag.toLowerCase().includes(searchLower)))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected option - default is newest first
      if (sortBy === 'newest') {
        return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.date || '').getTime() - new Date(b.date || '').getTime();
      } else if (sortBy === 'name-asc') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'name-desc') {
        return b.title.localeCompare(a.title);
      }
      return 0;
    });
  
  // Apply animations when component mounts or filter changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gsap && gridRef.current) {
      const cards = gridRef.current.querySelectorAll('[data-card]');
      if (cards.length > 0) {
        staggerFadeIn(cards, 0.05, 0.5);
      }
    }
  }, [activeCategory, searchTerm, sortBy]);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };
  
  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };
  
  return (
    <div className="space-y-6">
      {title && <h2 className="text-3xl font-bold tracking-tight">{title}</h2>}
      
      {showFilters && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search components..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>
            
            <div className="w-full sm:w-48">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {categories.length > 1 && (
            <Tabs value={activeCategory} onValueChange={handleCategoryChange} className="w-full">
              <TabsList className="w-full max-w-full flex flex-wrap h-auto py-1 px-1">
                {categories.map(cat => (
                  <TabsTrigger 
                    key={cat} 
                    value={cat}
                    className="capitalize"
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </div>
      )}
      
      {filteredComponents.length > 0 ? (
        <div 
          ref={gridRef} 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {filteredComponents.map((component, index) => (
            <div key={component.id} data-card>
              <ComponentCard 
                key={component.id}
                component={component} 
                index={index}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold mb-2">No components found</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            We couldn't find any components matching your search criteria. 
            Try adjusting your filters or search term.
          </p>
          <Button 
            onClick={() => {
              setSearchTerm('');
              setActiveCategory('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ComponentGrid;
