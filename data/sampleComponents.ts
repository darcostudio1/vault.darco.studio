// Define the component data structure
import { Component } from '../types/Component';

// Sample component data
export const sampleComponents: Component[] = [
  // BUTTONS
  {
    id: 'burger-menu-button',
    title: 'Burger Menu Button',
    description: 'A responsive burger menu button with smooth open/close animations',
    previewImage: '/images/buttons/burger-menu-button.jpg',
    previewVideo: '/videos/buttons/burger-menu-button.mp4',
    mediaType: 'video',
    category: 'BUTTONS',
    tags: ['UI', 'Animation', 'Interactive'],
    featured: true,
    date: '2025-03-11',
    author: 'Darco Studio',
    slug: 'burger-menu-button',
    dependencies: ['none']
  },
  {
    id: 'btn-1',
    title: 'Animated Button',
    description: 'A customizable button component with smooth hover and click animations',
    previewImage: '/images/buttons/animated-button.svg',
    category: 'BUTTONS',
    tags: ['UI', 'Animation', 'Interactive'],
    featured: true,
    date: '2023-12-05',
    author: 'Darco Studio',
    dependencies: ['gsap', 'styled-components']
  },
  {
    id: 'btn-2',
    title: 'Magnetic Button',
    description: 'Button that attracts the cursor with a magnetic effect on hover',
    previewImage: '/images/buttons/magnetic-button.svg',
    category: 'BUTTONS',
    tags: ['UI', 'Animation', 'Interactive'],
    date: '2023-11-20',
    author: 'Darco Studio'
  },
  {
    id: 'btn-3',
    title: 'Gradient Button',
    description: 'Button with animated gradient background that shifts on hover',
    previewImage: '/images/buttons/gradient-button.svg',
    category: 'BUTTONS',
    tags: ['UI', 'Animation', 'CSS'],
    date: '2023-10-15',
    author: 'Darco Studio'
  },
  
  // CURSOR ANIMATIONS
  {
    id: 'cursor-1',
    title: 'Custom Cursor',
    description: 'Replace default cursor with a custom designed cursor that follows mouse movement',
    previewImage: '/images/cursor-animations/custom-cursor.svg',
    category: 'CURSOR ANIMATIONS',
    tags: ['Animation', 'Interaction', 'JavaScript'],
    featured: true,
    date: '2024-01-05',
    author: 'Darco Studio'
  },
  {
    id: 'cursor-2',
    title: 'Magnetic Elements',
    description: 'Elements that attract the cursor when it comes near them',
    previewImage: '/images/cursor-animations/magnetic-elements.svg',
    category: 'CURSOR ANIMATIONS',
    tags: ['Animation', 'Interaction', 'JavaScript'],
    date: '2023-12-15',
    author: 'Darco Studio'
  },
  
  // DROPDOWNS & INFORMATION
  {
    id: 'dropdown-1',
    title: 'Animated Dropdown',
    description: 'Smooth animated dropdown menu with customizable transitions',
    previewImage: '/images/dropdowns/animated-dropdown.svg',
    category: 'DROPDOWNS & INFORMATION',
    tags: ['UI', 'Navigation', 'Animation'],
    date: '2023-11-10',
    author: 'Darco Studio'
  },
  {
    id: 'dropdown-2',
    title: 'Tooltip System',
    description: 'Customizable tooltips that appear on hover with various positioning options',
    previewImage: '/images/dropdowns/tooltip-system.svg',
    category: 'DROPDOWNS & INFORMATION',
    tags: ['UI', 'Information', 'Interaction'],
    featured: true,
    date: '2023-12-20',
    author: 'Darco Studio'
  },
  
  // FILTERS & SORTING
  {
    id: 'filter-1',
    title: 'Filter Grid',
    description: 'Filterable grid with smooth animations when items are filtered',
    previewImage: '/images/filters/filter-grid.svg',
    category: 'FILTERS & SORTING',
    tags: ['UI', 'Interaction', 'JavaScript'],
    featured: true,
    date: '2023-12-25',
    author: 'Darco Studio'
  },
  {
    id: 'filter-2',
    title: 'Sort Controls',
    description: 'UI controls for sorting items with various animations',
    previewImage: '/images/filters/sort-controls.svg',
    category: 'FILTERS & SORTING',
    tags: ['UI', 'Interaction', 'JavaScript'],
    date: '2023-11-15',
    author: 'Darco Studio'
  },
  
  // FORMS
  {
    id: 'form-1',
    title: 'Animated Form Fields',
    description: 'Form inputs with smooth label animations and validation effects',
    previewImage: '/images/forms/animated-form-fields.svg',
    category: 'FORMS',
    tags: ['UI', 'Forms', 'Animation'],
    date: '2023-12-25',
    author: 'Darco Studio'
  },
  {
    id: 'form-2',
    title: 'Custom Select',
    description: 'Fully customized select dropdown with animations and search functionality',
    previewImage: '/images/forms/custom-select.svg',
    category: 'FORMS',
    tags: ['UI', 'Forms', 'JavaScript'],
    date: '2023-11-15',
    author: 'Darco Studio'
  },
  
  // GALLERY & IMAGES
  {
    id: 'gallery-1',
    title: 'Image Gallery',
    description: 'Responsive image gallery with lightbox and smooth transitions',
    previewImage: '/images/galleries/image-gallery.svg',
    category: 'GALLERY & IMAGES',
    tags: ['UI', 'Images', 'Interaction'],
    featured: true,
    date: '2023-12-10',
    author: 'Darco Studio'
  },
  {
    id: 'gallery-2',
    title: 'Image Comparison',
    description: 'Before/after image comparison slider with smooth interaction',
    previewImage: '/images/galleries/image-comparison.svg',
    category: 'GALLERY & IMAGES',
    tags: ['UI', 'Images', 'Interaction'],
    date: '2023-11-25',
    author: 'Darco Studio'
  },
  
  // GIMMICKS
  {
    id: 'gimmick-1',
    title: 'Particle Effects',
    description: 'Interactive particle animations that respond to user interaction',
    previewImage: '/images/gimmicks/particle-effects.svg',
    category: 'GIMMICKS',
    tags: ['Animation', 'Canvas', 'JavaScript'],
    featured: true,
    date: '2024-01-10',
    author: 'Darco Studio'
  },
  {
    id: 'gimmick-2',
    title: 'Glitch Text Effect',
    description: 'Create a glitchy text effect with randomized distortions',
    previewImage: '/images/gimmicks/glitch-text-effect.svg',
    category: 'GIMMICKS',
    tags: ['Animation', 'Typography', 'CSS'],
    date: '2023-12-05',
    author: 'Darco Studio'
  },
  
  // HOVER INTERACTIONS
  {
    id: 'hover-1',
    title: 'Image Hover Effects',
    description: 'Collection of creative hover effects for images',
    previewImage: '/images/hover-effects/image-hover-effects.svg',
    category: 'HOVER INTERACTIONS',
    tags: ['Animation', 'CSS', 'Images'],
    featured: true,
    date: '2023-12-30',
    author: 'Darco Studio'
  },
  {
    id: 'hover-2',
    title: 'Text Hover Animations',
    description: 'Creative hover animations for text elements',
    previewImage: '/images/hover-effects/text-hover-animations.svg',
    category: 'HOVER INTERACTIONS',
    tags: ['Animation', 'Typography', 'CSS'],
    date: '2023-11-30',
    author: 'Darco Studio'
  },
  
  // LOADERS
  {
    id: 'loader-1',
    title: 'Morphing Loader',
    description: 'Loading animation that morphs between different shapes',
    previewImage: '/images/loaders/morphing-loader.svg',
    category: 'LOADERS',
    tags: ['Animation', 'SVG', 'Loading'],
    featured: true,
    date: '2023-12-15',
    author: 'Darco Studio'
  },
  {
    id: 'loader-2',
    title: 'Minimal Spinner',
    description: 'Clean and minimal loading spinner with customizable properties',
    previewImage: '/images/loaders/minimal-spinner.svg',
    category: 'LOADERS',
    tags: ['Animation', 'CSS', 'Loading'],
    date: '2023-11-10',
    author: 'Darco Studio'
  },
  
  // NAVIGATION
  {
    id: 'nav-1',
    title: 'Animated Menu',
    description: 'Responsive navigation menu with smooth animations',
    previewImage: '/images/navigation/animated-menu.svg',
    category: 'NAVIGATION',
    tags: ['UI', 'Navigation', 'Animation'],
    featured: true,
    date: '2023-12-20',
    author: 'Darco Studio'
  },
  {
    id: 'nav-2',
    title: 'Mega Menu',
    description: 'Expandable mega menu with multiple columns and animations',
    previewImage: '/images/navigation/mega-menu.svg',
    category: 'NAVIGATION',
    tags: ['UI', 'Navigation', 'Interaction'],
    date: '2023-11-20',
    author: 'Darco Studio'
  },
  
  // PAGE TRANSITIONS
  {
    id: 'transition-1',
    title: 'Page Transition',
    description: 'Smooth transitions between pages with various animation options',
    previewImage: '/images/page-transitions/page-transition.svg',
    category: 'PAGE TRANSITIONS',
    tags: ['Animation', 'Navigation', 'JavaScript'],
    featured: true,
    date: '2024-01-15',
    author: 'Darco Studio',
    dependencies: ['gsap', 'barba.js']
  },
  {
    id: 'transition-2',
    title: 'View Transitions',
    description: 'Modern view transitions API implementation with fallbacks',
    previewImage: '/images/page-transitions/view-transitions.svg',
    category: 'PAGE TRANSITIONS',
    tags: ['Animation', 'Navigation', 'JavaScript'],
    date: '2023-12-25',
    author: 'Darco Studio'
  },
  
  // SCROLL ANIMATIONS
  {
    id: 'scroll-1',
    title: 'Smooth Scroll',
    description: 'Implementation of butter-smooth scrolling with customizable easing',
    previewImage: '/images/scroll-animations/smooth-scroll.svg',
    category: 'SCROLL ANIMATIONS',
    tags: ['Animation', 'Interaction', 'JavaScript'],
    featured: true,
    date: '2023-12-30',
    author: 'Darco Studio',
    dependencies: ['lenis']
  },
  {
    id: 'scroll-2',
    title: 'Parallax Sections',
    description: 'Create depth with parallax scrolling effects for multiple layers',
    previewImage: '/images/scroll-animations/parallax-sections.svg',
    category: 'SCROLL ANIMATIONS',
    tags: ['Animation', 'Parallax', 'GSAP'],
    date: '2023-11-30',
    author: 'Darco Studio',
    dependencies: ['gsap', 'gsap/ScrollTrigger']
  },
  
  // SECTIONS
  {
    id: 'section-1',
    title: 'Hero Section',
    description: 'Animated hero section with text animations and background effects',
    previewImage: '/images/sections/hero-section.svg',
    category: 'SECTIONS',
    tags: ['UI', 'Layout', 'Animation'],
    featured: true,
    date: '2024-01-20',
    author: 'Darco Studio'
  },
  {
    id: 'section-2',
    title: 'Accordion Sections',
    description: 'Expandable accordion sections with smooth animations',
    previewImage: '/images/sections/accordion-sections.svg',
    category: 'SECTIONS',
    tags: ['UI', 'Layout', 'Interaction'],
    date: '2023-12-15',
    author: 'Darco Studio'
  },
  
  // SLIDERS & MARQUEES
  {
    id: 'slider-1',
    title: 'Infinite Marquee',
    description: 'Smooth infinite scrolling marquee with customizable speed and direction',
    previewImage: '/images/sliders/infinite-marquee.svg',
    category: 'SLIDERS & MARQUEES',
    tags: ['Animation', 'UI', 'JavaScript'],
    featured: true,
    date: '2024-01-25',
    author: 'Darco Studio'
  },
  {
    id: 'slider-2',
    title: 'Advanced Slider',
    description: 'Feature-rich slider with various transition effects and controls',
    previewImage: '/images/sliders/advanced-slider.svg',
    category: 'SLIDERS & MARQUEES',
    tags: ['UI', 'Interaction', 'JavaScript'],
    date: '2023-12-10',
    author: 'Darco Studio',
    dependencies: ['swiper']
  },
  
  // UTILITIES & SCRIPTS
  {
    id: 'util-1',
    title: 'Color Utilities',
    description: 'A collection of utility functions for color manipulation and conversion',
    previewImage: '/images/utilities/color-utilities.svg',
    category: 'UTILITIES & SCRIPTS',
    tags: ['Utility', 'Colors', 'JavaScript'],
    featured: true,
    date: '2023-11-15',
    author: 'Darco Studio',
    dependencies: ['color-convert', 'chroma-js']
  },
  {
    id: 'util-2',
    title: 'Responsive Breakpoints',
    description: 'Utility functions for handling responsive breakpoints in your application',
    previewImage: '/images/utilities/responsive-breakpoints.svg',
    category: 'UTILITIES & SCRIPTS',
    tags: ['Responsive', 'CSS', 'Media Queries'],
    date: '2023-10-28',
    author: 'Darco Studio'
  },
  
  // VIDEO & AUDIO
  {
    id: 'video-1',
    title: 'Video Player',
    description: 'Custom video player with advanced controls and animations',
    previewImage: '/images/videos/video-player.svg',
    category: 'VIDEO & AUDIO',
    tags: ['Video', 'UI', 'Interaction'],
    featured: true,
    date: '2024-01-30',
    author: 'Darco Studio'
  },
  {
    id: 'video-2',
    title: 'Audio Visualizer',
    description: 'Audio visualization with canvas and WebAudio API',
    previewImage: '/images/videos/audio-visualizer.svg',
    category: 'VIDEO & AUDIO',
    tags: ['Audio', 'Canvas', 'JavaScript'],
    date: '2023-12-05',
    author: 'Darco Studio'
  }
];

// Extended component data with additional details for component detail pages
export const detailedComponents = sampleComponents.map(component => {
  let usage = '';
  let code = '';
  let documentation = '';
  let relatedComponents: string[] = [];

  // Add specific details based on component type
  switch(component.slug) {
    case 'animated-button':
      usage = `import { AnimatedButton } from '@darco/components';\n\nfunction MyComponent() {\n  return (\n    <AnimatedButton\n      text="Click Me"\n      color="primary"\n      onClick={() => alert('Button clicked!')}\n    />\n  );\n}`;
      code = `import React from 'react';\nimport styled from 'styled-components';\n\nconst StyledButton = styled.button\`\n  padding: 0.75rem 1.5rem;\n  border-radius: 8px;\n  font-weight: 500;\n  background-color: var(--accent-color);\n  color: white;\n  border: none;\n  cursor: pointer;\n  transition: transform 0.2s ease, box-shadow 0.2s ease;\n  \n  &:hover {\n    transform: translateY(-2px);\n    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n  }\n  \n  &:active {\n    transform: translateY(0);\n    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n  }\n\`;\n\nexport default function AnimatedButton({ text, color, onClick }) {\n  return (\n    <StyledButton onClick={onClick}>\n      {text}\n    </StyledButton>\n  );\n}`;
      documentation = 'The AnimatedButton component provides a visually appealing button with hover and click animations. It supports customization through props for text content, color theme, and click handlers.';
      relatedComponents = ['Gradient Button', 'Tooltip System', 'Animated Form Inputs'];
      break;
    case 'parallax-scroll':
      usage = `import { ParallaxScroll } from '@darco/components';\n\nfunction MyComponent() {\n  const layers = [\n    { image: '/images/layer1.png', speed: 0.2 },\n    { image: '/images/layer2.png', speed: 0.4 },\n    { image: '/images/layer3.png', speed: 0.6 },\n  ];\n\n  return (\n    <ParallaxScroll layers={layers} height="80vh" />\n  );\n}`;
      code = `import React, { useEffect, useRef } from 'react';\nimport styled from 'styled-components';\n\nconst ParallaxContainer = styled.div\`\n  position: relative;\n  overflow: hidden;\n  width: 100%;\n  height: \${props => props.height || '100vh'};\n\`;\n\nconst ParallaxLayer = styled.div\`\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background-image: url(\${props => props.image});\n  background-size: cover;\n  background-position: center;\n  will-change: transform;\n\`;\n\nexport default function ParallaxScroll({ layers, height }) {\n  const containerRef = useRef(null);\n  const layerRefs = useRef([]);\n  \n  useEffect(() => {\n    const handleScroll = () => {\n      if (!containerRef.current) return;\n      \n      const containerRect = containerRef.current.getBoundingClientRect();\n      const containerTop = containerRect.top;\n      const containerHeight = containerRect.height;\n      const viewportHeight = window.innerHeight;\n      \n      // Only animate when the container is in view\n      if (containerTop < viewportHeight && containerTop + containerHeight > 0) {\n        const scrollProgress = (viewportHeight - containerTop) / (viewportHeight + containerHeight);\n        \n        layerRefs.current.forEach((layer, index) => {\n          if (layer && layers[index]) {\n            const yOffset = (scrollProgress - 0.5) * layers[index].speed * 100;\n            layer.style.transform = \`translateY(\${yOffset}px)\`;\n          }\n        });\n      }\n    };\n    \n    window.addEventListener('scroll', handleScroll);\n    handleScroll(); // Initial positioning\n    \n    return () => window.removeEventListener('scroll', handleScroll);\n  }, [layers]);\n  \n  return (\n    <ParallaxContainer ref={containerRef} height={height}>\n      {layers.map((layer, index) => (\n        <ParallaxLayer\n          key={index}\n          ref={el => layerRefs.current[index] = el}\n          image={layer.image}\n        />\n      ))}\n    </ParallaxContainer>\n  );\n}`;
      documentation = 'The ParallaxScroll component creates a parallax scrolling effect with multiple layers moving at different speeds. Each layer can have its own image and speed factor to create depth and visual interest as the user scrolls.';
      relatedComponents = ['Scroll Triggered Animations', 'Page Transition System', 'Hero Section'];
      break;
    default:
      usage = `import { ${component.title.replace(/\s+/g, '')} } from '@darco/components';\n\nfunction MyComponent() {\n  return (\n    <${component.title.replace(/\s+/g, '')}\n      // Add props here\n    />\n  );\n}`;
      code = `import React from 'react';\n\nexport default function ${component.title.replace(/\s+/g, '')}(props) {\n  return (\n    <div className="${component.slug}">\n      {/* Component implementation */}\n      <h2>Example ${component.title}</h2>\n      <p>This is a sample implementation.</p>\n    </div>\n  );\n}`;
      documentation = `The ${component.title} component provides a standardized way to display content with consistent styling and behavior.`;
      relatedComponents = sampleComponents
        .filter(c => c.id !== component.id && c.category === component.category)
        .slice(0, 3)
        .map(c => c.title);
  }

  return {
    ...component,
    usage,
    code,
    documentation,
    relatedComponents
  };
});
