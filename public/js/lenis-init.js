// Initialize Lenis smooth scrolling
document.addEventListener('DOMContentLoaded', function() {
  // Check if Lenis is available
  if (typeof window.Lenis === 'function') {
    // Create Lenis instance
    const lenis = new window.Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Lenis scroll function
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    // Start the animation
    requestAnimationFrame(raf);
    
    console.log('Lenis smooth scrolling initialized');
  } else {
    console.warn('Lenis not found. Make sure the script is loaded correctly.');
  }
}); 