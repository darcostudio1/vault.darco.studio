// Import GSAP and its plugins
import gsap from 'gsap';
import { CustomEase } from 'gsap/dist/CustomEase';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
// SplitText is a premium GSAP plugin, so we'll implement our own text splitting

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase, ScrollTrigger);
  
  // Create custom easing functions
  CustomEase.create('cubic-default', '0.625, 0.05, 0, 1');
  CustomEase.create('cubic-header', '0.25, 0.1, 0, 1');
}

// Custom text splitting function to replace SplitText
export const splitTextIntoChars = (element: Element): HTMLSpanElement[] => {
  if (!element || !element.textContent) return [];
  
  const text = element.textContent;
  const chars: HTMLSpanElement[] = [];
  
  // Clear the element
  element.innerHTML = '';
  
  // Create spans for each character
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char === ' ' ? '\u00A0' : char; // Use non-breaking space for spaces
    element.appendChild(span);
    chars.push(span);
  }
  
  return chars;
};

// Simple fade in animation for elements
export const fadeIn = (element: Element, delay = 0, duration = 0.6) => {
  if (!element) return;
  
  return gsap.fromTo(
    element,
    { opacity: 0, y: 20 },
    { 
      opacity: 1, 
      y: 0, 
      duration: duration,
      delay: delay,
      ease: 'cubic-default',
    }
  );
};

// Stagger fade in animation for elements
export const staggerFadeIn = (elements: Element[] | NodeListOf<Element>, staggerTime = 0.05, duration = 0.6) => {
  if (!elements || elements.length === 0) return;
  
  return gsap.fromTo(
    elements,
    { opacity: 0, y: 20 },
    { 
      opacity: 1, 
      y: 0, 
      duration: duration,
      stagger: staggerTime,
      ease: 'cubic-default',
      clearProps: 'transform'
    }
  );
};

// Header animation for page titles and subtitles
export const animateHeader = (container: string | Element) => {
  if (typeof window === 'undefined') return;
  
  const headerElement = typeof container === 'string' 
    ? document.querySelector(container) 
    : container;
    
  if (!headerElement) return;
  
  const title = headerElement.querySelector('.page-title');
  const subtitle = headerElement.querySelector('.page-subtitle');
  const description = headerElement.querySelector('.page-description');
  
  const timeline = gsap.timeline({ defaults: { ease: 'cubic-header' } });
  
  if (title) {
    const splitTitle = splitTextIntoChars(title);
    timeline.fromTo(
      splitTitle,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.02 },
      0
    );
  }
  
  if (subtitle) {
    timeline.fromTo(
      subtitle,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      0.3
    );
  }
  
  if (description) {
    timeline.fromTo(
      description,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      0.5
    );
  }
  
  return timeline;
};

// Page transition animation
export const pageTransition = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.625, 0.05, 0, 1], // cubic-default equivalent
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: [0.625, 0.05, 0, 1],
    },
  },
};

// Loader animation
export const animateLoader = (loaderElement: Element, onComplete?: () => void) => {
  if (typeof window === 'undefined' || !loaderElement) return;
  
  const timeline = gsap.timeline({
    onComplete: () => {
      if (onComplete) onComplete();
    }
  });
  
  timeline
    .to(loaderElement, { 
      duration: 0.5, 
      opacity: 0, 
      ease: 'cubic-default',
      onComplete: () => {
        loaderElement.classList.add('hidden');
      }
    });
    
  return timeline;
};

// Scroll animation for elements
export const animateOnScroll = (elements: string | Element | Element[], options = {}) => {
  if (typeof window === 'undefined') return;
  
  const defaultOptions = {
    start: 'top 80%',
    end: 'bottom 20%',
    toggleActions: 'play none none reverse',
    markers: false,
    once: false,
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: 'cubic-default' }
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  let targetElements: Element[] = [];
  
  if (typeof elements === 'string') {
    targetElements = Array.from(document.querySelectorAll(elements));
  } else if (elements instanceof Element) {
    targetElements = [elements];
  } else if (Array.isArray(elements)) {
    targetElements = elements;
  }
  
  if (targetElements.length === 0) return;
  
  targetElements.forEach(element => {
    ScrollTrigger.create({
      trigger: element,
      start: mergedOptions.start,
      end: mergedOptions.end,
      toggleActions: mergedOptions.toggleActions,
      markers: mergedOptions.markers,
      once: mergedOptions.once,
      onEnter: () => {
        gsap.fromTo(element, mergedOptions.from, mergedOptions.to);
      },
      onEnterBack: () => {
        if (!mergedOptions.once) {
          gsap.fromTo(element, mergedOptions.from, mergedOptions.to);
        }
      },
      onLeaveBack: () => {
        if (!mergedOptions.once) {
          gsap.fromTo(element, mergedOptions.to, mergedOptions.from);
        }
      }
    });
  });
};

// Initialize smooth scroll with Lenis
export const initSmoothScroll = () => {
  // Smooth scrolling has been removed
  console.log('Smooth scrolling is disabled');
  return null;
};

// Add global type for window with GSAP plugins
declare global {
  interface Window {
    gsap: typeof gsap;
  }
}
