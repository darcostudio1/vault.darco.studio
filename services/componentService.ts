import { Component } from '../types/Component';
import { componentsArray, getAllComponents as getCodeComponents } from '../data/componentRegistry';

/**
 * Component Service
 * 
 * This service integrates custom components added through the UI
 * with the code-defined components from componentRegistry.
 */

// Get custom components from localStorage (or other storage in the future)
export const getCustomComponents = (): Component[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const customComponentsJson = localStorage.getItem('customComponents');
    return customComponentsJson ? JSON.parse(customComponentsJson) : [];
  } catch (error) {
    console.error('Error loading custom components:', error);
    return [];
  }
};

// Get all components (code-defined + custom) sorted by date (most recent first)
export const getAllComponents = (): Component[] => {
  const customComponents = getCustomComponents();
  const allComponents = [...componentsArray, ...customComponents];
  
  // Sort by date (most recent first)
  return allComponents.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

// Get component by slug
export const getComponentBySlug = (slug: string): Component | undefined => {
  const allComponents = getAllComponents();
  return allComponents.find(component => component.slug === slug);
};

// Get components by category
export const getComponentsByCategory = (category: string): Component[] => {
  const allComponents = getAllComponents();
  return allComponents
    .filter(component => component.category.toLowerCase() === category.toLowerCase())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get all categories with count
export const getAllCategories = (): { name: string; count: number }[] => {
  const allComponents = getAllComponents();
  const categories = allComponents.reduce((acc, component) => {
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
  const allComponents = getAllComponents();
  const tags = allComponents.reduce((acc, component) => {
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

// Delete a custom component
export const deleteCustomComponent = (id: string): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const customComponents = getCustomComponents();
    const updatedComponents = customComponents.filter(comp => comp.id !== id);
    localStorage.setItem('customComponents', JSON.stringify(updatedComponents));
    return true;
  } catch (error) {
    console.error('Error deleting custom component:', error);
    return false;
  }
};

// Update a custom component
export const updateCustomComponent = (updatedComponent: Component): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const customComponents = getCustomComponents();
    const index = customComponents.findIndex(comp => comp.id === updatedComponent.id);
    
    if (index === -1) return false;
    
    customComponents[index] = updatedComponent;
    localStorage.setItem('customComponents', JSON.stringify(customComponents));
    return true;
  } catch (error) {
    console.error('Error updating custom component:', error);
    return false;
  }
};

export default {
  getAllComponents,
  getComponentBySlug,
  getComponentsByCategory,
  getAllCategories,
  getAllTags,
  getCustomComponents,
  deleteCustomComponent,
  updateCustomComponent
};
