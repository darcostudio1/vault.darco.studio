import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ComponentItem } from '../data/sampleComponents';

interface SidebarProps {
  components?: ComponentItem[];
  className?: string;
}

export default function Sidebar({ components = [], className = '' }: SidebarProps) {
  // Get categories and counts from components
  const getCategoriesWithCounts = () => {
    const categoryCounts: Record<string, number> = {};
    
    components.forEach(component => {
      const category = component.category;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    return Object.entries(categoryCounts)
      .sort((a, b) => a[0].localeCompare(b[0])) // Sort alphabetically
      .map(([category, count]) => ({ category, count }));
  };
  
  const categories = getCategoriesWithCounts();
  const totalComponents = components.length;
  
  // Get featured components (marked as featured or most recent)
  const featuredComponents = components
    .filter(comp => comp.featured)
    .slice(0, 3);
  
  // Get recent components (most recent 3)
  const recentComponents = [...components]
    .sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime())
    .slice(0, 3);
  
  return (
    <aside className={`sidebar ${className}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <Link href="/" className="sidebar-logo">
          <span className="sidebar-logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M21 16V8c0-.7-.4-1.4-1-1.7L13 2.2c-.6-.4-1.4-.4-2 0L4 6.2C3.4 6.6 3 7.2 3 8v8c0 .7.4 1.4 1 1.8l7 4c.6.4 1.4.4 2 0l7-4c.6-.4 1-.9 1-1.8Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22.1V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 12l8.7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.3 7l8.7 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="sidebar-logo-text">DARCO Vault</span>
        </Link>
      </div>
      
      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <Link href="/" className="sidebar-nav-item">
          <span className="sidebar-nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 22V12H15V22M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span>Home</span>
        </Link>
        
        <Link href="/all-components" className="sidebar-nav-item">
          <span className="sidebar-nav-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span>All Components</span>
          <span className="sidebar-nav-count">{totalComponents}</span>
        </Link>
      </nav>
      
      {/* Categories Section */}
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Categories</h3>
        <div className="sidebar-categories">
          {categories.map(({ category, count }) => (
            <Link 
              key={category} 
              href={`/category/${category.toLowerCase()}`} 
              className="sidebar-category-item"
            >
              <span className="sidebar-category-name">{category}</span>
              <span className="sidebar-category-count">{count}</span>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Featured Components Section */}
      {featuredComponents.length > 0 && (
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Featured</h3>
          <div className="sidebar-components">
            {featuredComponents.map(component => (
              <Link 
                key={component.id} 
                href={`/component/${component.slug}`} 
                className="sidebar-component-item"
              >
                <span className="sidebar-component-title">{component.title}</span>
                <span className="sidebar-component-category">{component.category}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Recent Components Section */}
      {recentComponents.length > 0 && (
        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Recent</h3>
          <div className="sidebar-components">
            {recentComponents.map(component => (
              <Link 
                key={component.id} 
                href={`/component/${component.slug}`} 
                className="sidebar-component-item"
              >
                <span className="sidebar-component-title">{component.title}</span>
                <span className="sidebar-component-category">{component.category}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="sidebar-footer">
        <p className="sidebar-footer-text"> 2023 DARCO Studio</p>
      </div>
    </aside>
  );
}