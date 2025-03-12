import { Component } from '../../types/Component';

/**
 * Component Template
 * 
 * This file serves as a template for creating new components.
 * To create a new component:
 * 1. Duplicate this file
 * 2. Rename it to match your component's slug (e.g., my-new-component.ts)
 * 3. Update all the fields below
 * 4. Import and add your component to the componentRegistry.ts file
 */

export const componentTemplate: Component = {
  // Basic Information
  id: 'component-id', // Unique identifier (kebab-case)
  title: 'Component Title', // Display name
  description: 'Brief description of what this component does', // 1-2 sentences
  category: 'CATEGORY', // e.g., BUTTONS, CARDS, FORMS, etc.
  date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  
  // Media
  previewImage: '/images/category/component-id.jpg', // Path to preview image
  previewVideo: '/videos/category/component-id.mp4', // Optional path to preview video
  mediaType: 'image', // 'image' or 'video'
  
  // Metadata
  tags: ['UI', 'Interactive'], // Relevant tags
  author: 'Darco Studio', // Creator name
  featured: false, // Whether this is a featured component
  slug: 'component-id', // URL-friendly name (same as id)
  dependencies: [], // External dependencies
  
  // Optional URLs
  demoUrl: '', // Live demo URL
  githubUrl: '', // Source code URL
  
  // Code Content
  content: {
    externalScripts: `<!-- External Scripts -->
<script src="https://example.com/library.js"></script>`,

    html: `<!-- Component HTML -->
<div class="component-id">
  <button class="component-id-button">
    Component Title
  </button>
</div>`,

    css: `/* Component CSS */
.component-id {
  display: flex;
  justify-content: center;
  align-items: center;
}

.component-id-button {
  padding: 12px 24px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.component-id-button:hover {
  background-color: #2980b9;
}`,

    js: `// Component JavaScript
document.addEventListener('DOMContentLoaded', function() {
  const button = document.querySelector('.component-id-button');
  
  if (button) {
    button.addEventListener('click', function() {
      alert('Component Title button clicked!');
    });
  }
});`
  }
};

export default componentTemplate;
