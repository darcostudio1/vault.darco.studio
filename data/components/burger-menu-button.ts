import { Component } from '../../types/Component';

/**
 * Burger Menu Button Component
 */

const burgerMenuButton: Component = {
  // Basic Information
  id: 'burger-menu-button',
  title: 'Burger Menu Button',
  description: 'A responsive burger menu button with smooth open/close animations',
  category: 'BUTTONS',
  date: '2025-03-11',
  
  // Media
  previewImage: '/images/buttons/burger-menu-button.jpg',
  previewVideo: '/videos/buttons/burger-menu-button.mp4',
  mediaType: 'video',
  
  // Metadata
  tags: ['UI', 'Animation', 'Interactive'],
  author: 'Darco Studio',
  featured: true,
  slug: 'burger-menu-button',
  externalSourceUrl: 'https://github.com/darco-studio/ui-components/burger-menu',
  
  // Implementation details
  implementation: `
<h4>Vimeo Video ID</h4>
<p>To load the correct Vimeo video, locate the numeric ID in the Vimeo URL (e.g., 101919082). Ensure the video is allowed to be embedded under its Vimeo settings.</p>
<p>Add this ID to the attribute <code>data-vimeo-video-id="101919082"</code>.</p>

<h4>Update Size (Aspect Ratio)</h4>
<p>When the attribute <code>data-vimeo-update-size="true"</code> is set to true, the player will retrieve the video's dimensions and update the <code>.vimeo-player_before</code> element's padding-top to maintain the correct aspect ratio in percentages. Example: <code>padding-top: 56.25%;</code> - 16:9 ratio.</p>

<h4>Muted</h4>
<p>Set the attribute <code>data-vimeo-muted="true"</code> to start the video muted.</p>
`,

  moreInformation: `
<h4>Play/Pause</h4>
<p>The elements with the attributes <code>data-vimeo-control="play"</code> and <code>data-vimeo-control="pause"</code> allow the user to play or pause the video. These actions update the <code>data-vimeo-playing="false"</code> attribute from 'false' to 'true' or vice versa. You can use this attribute to control the visibility of the player interface during playback.</p>

<h4>Additional Resources</h4>
<ul>
  <li><a href="https://developer.vimeo.com/player/sdk" target="_blank">Vimeo Player SDK Documentation</a></li>
  <li><a href="https://vimeo.zendesk.com/hc/en-us/articles/360001494447-Using-Player-Parameters" target="_blank">Vimeo Player Parameters Guide</a></li>
</ul>
`,

  // Code Content
  content: {
    externalScripts: `<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/CustomEase.min.js"></script>`,

    html: `<!-- Burger Menu Button HTML -->
<button class="burger-menu-button" aria-label="Toggle menu" aria-expanded="false">
  <span class="bar"></span>
  <span class="bar"></span>
  <span class="bar"></span>
</button>`,

    css: `.burger-menu-button {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 24px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;
  transition: all 0.3s ease;
}

.burger-menu-button:focus {
  outline: none;
}

.bar {
  display: block;
  width: 100%;
  height: 3px;
  border-radius: 3px;
  background-color: #000;
  transition: all 0.3s ease;
  transform-origin: center;
}

/* Animation for open state */
.burger-menu-button.open .bar:nth-child(1) {
  transform: translateY(10.5px) rotate(45deg);
}

.burger-menu-button.open .bar:nth-child(2) {
  opacity: 0;
}

.burger-menu-button.open .bar:nth-child(3) {
  transform: translateY(-10.5px) rotate(-45deg);
}

/* Hover effects */
.burger-menu-button:hover .bar {
  width: 100%;
}

.burger-menu-button:hover .bar:nth-child(2) {
  width: 80%;
  margin-left: auto;
}

.burger-menu-button.open:hover .bar:nth-child(2) {
  width: 100%;
}`,

    js: `// Burger Menu Button JavaScript
document.addEventListener('DOMContentLoaded', function() {
  const burgerButton = document.querySelector('.burger-menu-button');
  
  if (burgerButton) {
    burgerButton.addEventListener('click', function() {
      this.classList.toggle('open');
      const isOpen = this.classList.contains('open');
      this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }
});`
  }
};

export default burgerMenuButton;
