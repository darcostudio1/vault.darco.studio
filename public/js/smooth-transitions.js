/**
 * DARCO Dev Vault - Smooth Transitions
 * Integrates Barba.js for page transitions and Lenis for smooth scrolling
 */

// Check if we're in a browser environment before executing
if (typeof window !== 'undefined') {
  (function() {
    // Initialize Lenis for smooth scrolling
    let lenis;

    // Initialize Barba.js
    function initBarba() {
      if (typeof barba === 'undefined' || typeof gsap === 'undefined') {
        console.warn('Barba.js or GSAP not loaded');
        return;
      }

      barba.init({
        debug: false,
        transitions: [
          {
            name: 'default-transition',
            leave(data) {
              // Animation to run when leaving a page
              return gsap.to(data.current.container, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: 'power2.inOut'
              });
            },
            enter(data) {
              // Animation to run when entering a page
              return gsap.from(data.next.container, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                ease: 'power2.inOut',
                onComplete: () => {
                  // Reinitialize Lenis after page transition
                  initLenis();
                  
                  // Reinitialize List.js enhancer if available
                  if (window.listJsInstance && window.ListEnhancer) {
                    new window.ListEnhancer(window.listJsInstance);
                  }
                }
              });
            }
          },
          {
            // Special transition for resource pages
            name: 'resource-transition',
            to: { namespace: ['resource'] },
            leave(data) {
              return gsap.to(data.current.container, {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.inOut'
              });
            },
            enter(data) {
              // Scroll to top when entering a resource page
              window.scrollTo(0, 0);
              
              // Staggered animation for resource page elements
              const timeline = gsap.timeline();
              const container = data.next.container;
              const header = container.querySelector('.resource-header');
              const content = container.querySelector('.code-block-wrapper');
              const notes = container.querySelector('.resource-notes');
              
              if (header) timeline.from(header, { opacity: 0, y: 20, duration: 0.5 });
              if (notes) timeline.from(notes, { opacity: 0, y: 20, duration: 0.5 }, '-=0.3');
              if (content) timeline.from(content, { opacity: 0, y: 20, duration: 0.5 }, '-=0.3');
              
              return timeline;
            },
            after() {
              // Reinitialize Lenis and other components
              initLenis();
              
              // Reinitialize Prism.js for code highlighting
              if (window.Prism) {
                window.Prism.highlightAll();
              }
            }
          }
        ],
        views: [
          {
            namespace: 'home',
            beforeEnter() {
              // Initialize List.js if on home page
              if (window.listJsInstance && window.ListEnhancer) {
                new window.ListEnhancer(window.listJsInstance);
              }
            }
          },
          {
            namespace: 'resource',
            beforeEnter() {
              // Initialize code tabs if on resource page
              const tabs = document.querySelectorAll('[data-tab]');
              if (tabs.length) {
                tabs.forEach(tab => {
                  tab.addEventListener('click', () => {
                    const target = tab.getAttribute('data-tab');
                    if (!target) return;
                    
                    // Update active tab
                    tabs.forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    
                    // Show active content
                    document.querySelectorAll('[data-tab-content]').forEach(content => {
                      content.classList.remove('active');
                    });
                    
                    const targetContent = document.querySelector(`[data-tab-content="${target}"]`);
                    if (targetContent) targetContent.classList.add('active');
                    
                    // Reinitialize Prism.js
                    if (window.Prism) {
                      window.Prism.highlightAll();
                    }
                  });
                });
              }
            }
          }
        ]
      });
    }

    // Initialize Lenis for smooth scrolling
    function initLenis() {
      if (typeof Lenis === 'undefined') {
        console.warn('Lenis not loaded');
        return;
      }

      // Destroy existing instance if it exists
      if (lenis) {
        lenis.destroy();
      }
      
      // Create new Lenis instance
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false
      });
      
      // Connect Lenis to RAF (request animation frame)
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      
      requestAnimationFrame(raf);
      
      // Add scroll listeners for animations
      lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
        // Animate elements based on scroll position
        const scrollElements = document.querySelectorAll('[data-scroll]');
        
        scrollElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          const isInView = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
          
          if (isInView) {
            el.classList.add('in-view');
          }
        });
      });
    }

    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
      // Initialize Lenis first
      initLenis();
      
      // Then initialize Barba.js
      initBarba();
    });
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        if (lenis) lenis.start();
      } else {
        if (lenis) lenis.stop();
      }
    });
    
    // Expose to window for debugging
    window.lenisInstance = lenis;
  })();
} 