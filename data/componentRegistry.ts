import { Component } from '../types/Component';

// Import all component templates
import burgerMenuButton from './components/burger-menu-button';
import stopMotionButton from './components/stop-motion-button';
// Import additional components as you create them
// import newComponent from './components/new-component';

/**
 * Component Registry
 * 
 * This file serves as a central registry for all components.
 * When adding a new component:
 * 1. Import the component file above
 * 2. Add it to the componentsArray below
 */

// Control whether to show sample components
const SHOW_SAMPLE_COMPONENTS = true;

// Array of all components
export const componentsArray: Component[] = SHOW_SAMPLE_COMPONENTS ? [
  burgerMenuButton,
  stopMotionButton,
  // Add new components here
] : [];

// Get all components sorted by date (most recent first)
export const getAllComponents = (): Component[] => {
  return [...componentsArray].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

// Get component by slug
export const getComponentBySlug = (slug: string): Component | undefined => {
  return componentsArray.find(component => component.slug === slug);
};

// Get components by category
export const getComponentsByCategory = (category: string): Component[] => {
  return componentsArray
    .filter(component => component.category.toLowerCase() === category.toLowerCase())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get all categories with count
export const getAllCategories = (): { name: string; count: number }[] => {
  const categories = componentsArray.reduce((acc, component) => {
    const category = component.category.toLowerCase();
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(categories)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Get all tags with count
export const getAllTags = (): { name: string; count: number }[] => {
  const tags = componentsArray.reduce((acc, component) => {
    component.tags?.forEach(tag => {
      if (!acc[tag]) {
        acc[tag] = 0;
      }
      acc[tag]++;
    });
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(tags)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

export default {
  getAllComponents,
  getComponentBySlug,
  getComponentsByCategory,
  getAllCategories,
  getAllTags
};
