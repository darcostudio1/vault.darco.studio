import { Component } from '../../types/Component';

/**
 * Stop Motion Button Component
 */

const componentName: Component = {
  // Basic Information
  id: 'stop-motion-button',
  title: 'Stop Motion Button',
  description: 'An animated stop motion button using CSS steps animation',
  category: 'BUTTONS',
  date: '2025-03-11',
  
  // Media
  previewImage: '/images/buttons/stop-motion-button.jpg',
  previewVideo: '/videos/buttons/stop-motion-button.mp4',
  mediaType: 'video',
  
  // Metadata
  tags: ['UI', 'Animation', 'Interactive'],
  author: 'Darco Studio',
  featured: true,
  slug: 'stop-motion-button',
  externalSourceUrl: 'https://github.com/darco-studio/ui-components/stop-motion',
  
  // Implementation details
  implementation: `
    <h4>CSS Steps Animation (Keyframes)</h4>
    <p>We are using the basic step CSS keyframe option. Basically this will play the animation in steps, what will make the "stop motion" effect.</p>
    
    <pre><code class="language-css">
@keyframes sprite {
  to {
    transform: translateX(-100%);
  }
}

[data-sprite] .btn-stop-motion__icon-svg {
  animation: sprite 0.45s steps(4, end) infinite;
}
    </code></pre>
  `,
  
  moreInformation: `
    <h4>Wiggle Animation</h4>
    <p>The button also has a wiggle animation that activates on hover. This creates a playful, dynamic effect that draws attention to the button.</p>
    
    <pre><code class="language-css">
@keyframes wiggle {
  from {
    transform: rotate(1deg);
  }
  to {
    transform: rotate(-1deg);
  }
}

[data-wiggle]:hover [data-wiggle-target] {
  animation: wiggle 0.3s steps(2, end) infinite;
}
    </code></pre>
  `,
  
  // Code Content
  content: {
    externalScripts: ``, // No external scripts needed
    
    html: `<!-- Stop Motion Button HTML -->
<a href="#" class="btn-stop-motion" data-wiggle data-sprite>
  <div class="btn-stop-motion__inner">
    <div class="btn-stop-motion__back">
      <svg class="btn-stop-motion__back-svg" xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 678 82" fill="none" preserveaspectratio="none"><path d="M460.308 7.5301L460.216 7.59846L460.136 7.68002C457.225 10.6259 456.112 14.1147 455.704 17.5301C455.426 19.853 455.426 22.1759 455.704 24.4988C456.112 27.9142 457.225 31.403 460.136 34.3489L460.216 34.4304L460.308 34.4988C463.219 37.4447 466.707 38.5577 470.123 38.9659C472.446 39.2438 474.769 39.2438 477.092 38.9659C480.507 38.5577 483.995 37.4447 486.906 34.4988L486.998 34.4304L487.078 34.3489C489.989 31.403 491.102 27.9142 491.51 24.4988C491.788 22.1759 491.788 19.853 491.51 17.5301C491.102 14.1147 489.989 10.6259 487.078 7.68002L486.998 7.59846L486.906 7.5301C483.995 4.58417 480.507 3.47119 477.092 3.06301C474.769 2.78509 472.446 2.78509 470.123 3.06301C466.707 3.47119 463.219 4.58417 460.308 7.5301ZM460.308 7.5301L460.216 7.59846L460.136 7.68002C457.225 10.6259 456.112 14.1147 455.704 17.5301C455.426 19.853 455.426 22.1759 455.704 24.4988C456.112 27.9142 457.225 31.403 460.136 34.3489L460.216 34.4304L460.308 34.4988C463.219 37.4447 466.707 38.5577 470.123 38.9659C472.446 39.2438 474.769 39.2438 477.092 38.9659C480.507 38.5577 483.995 37.4447 486.906 34.4988L486.998 34.4304L487.078 34.3489C489.989 31.403 491.102 27.9142 491.51 24.4988C491.788 22.1759 491.788 19.853 491.51 17.5301C491.102 14.1147 489.989 10.6259 487.078 7.68002L486.998 7.59846L486.906 7.5301C483.995 4.58417 480.507 3.47119 477.092 3.06301C474.769 2.78509 472.446 2.78509 470.123 3.06301C466.707 3.47119 463.219 4.58417 460.308 7.5301ZM460.308 7.5301L460.216 7.59846L460.136 7.68002C457.225 10.6259 456.112 14.1147 455.704 17.5301C455.426 19.853 455.426 22.1759 455.704 24.4988C456.112 27.9142 457.225 31.403 460.136 34.3489L460.216 34.4304L460.308 34.4988C463.219 37.4447 466.707 38.5577 470.123 38.9659C472.446 39.2438 474.769 39.2438 477.092 38.9659C480.507 38.5577 483.995 37.4447 486.906 34.4988L486.998 34.4304L487.078 34.3489C489.989 31.403 491.102 27.9142 491.51 24.4988C491.788 22.1759 491.788 19.853 491.51 17.5301C491.102 14.1147 489.989 10.6259 487.078 7.68002L486.998 7.59846L486.906 7.5301C483.995 4.58417 480.507 3.47119 477.092 3.06301C474.769 2.78509 472.446 2.78509 470.123 3.06301C466.707 3.47119 463.219 4.58417 460.308 7.5301Z" fill="currentColor"></path></svg>
    </div>
    <div class="btn-stop-motion__icon">
      <div class="before__100"></div>
      <svg class="btn-stop-motion__icon-svg" xmlns="http://www.w3.org/2000/svg" width="100%" viewbox="0 0 160 40" fill="none"><path d="M138.72 35.662C138.72 35.662 138.68 35.6604 138.655 35.6594C138.413 35.6171 138.235 35.3986 138.245 35.1472L138.785 21.8544L134.175 23.5194C134.001 23.5854 133.8 23.5448 133.659 23.4091C133.526 23.2818 133.469 23.0845 133.525 22.9L139.544 3.36319C139.619 3.12252 139.852 2.97764 140.103 3.02029C140.345 3.06262 140.523 3.28105 140.512 3.53247L139.973 16.8253L144.583 15.1603C144.765 15.0945 144.958 15.1349 145.099 15.2706C145.232 15.3978 145.289 15.5951 145.233 15.7797L139.214 35.3165C139.148 35.5332 138.939 35.679 138.72 35.6702L138.72 35.662Z" fill="currentColor"></path><path d="M100.389 35.966C100.389 35.966 100.349 35.9661 100.324 35.9662C100.081 35.9347 99.8932 35.7244 99.8922 35.4728L101.032 21.3271L94.5498 23.5735C93.0942 22.946 94.1764 23.6156 94.0297 23.4863C93.8912 23.365 93.8255 23.1705 93.8735 22.9836L99.7771 3.66243C99.8411 3.41867 100.068 3.26356 100.32 3.29505C100.563 3.32657 100.751 3.53688 100.752 3.78851L99.0734 18.229L105.161 17.3027C105.339 17.2289 105.534 17.2606 105.681 17.3899C105.82 17.5112 105.885 17.7058 105.837 17.8926L100.867 35.5988C100.811 35.8182 100.609 35.9732 100.389 35.9741L100.389 35.966Z" fill="currentColor"></path><path d="M58.6775 35.1145C58.6775 35.1145 58.637 35.111 58.6127 35.1089C58.3728 35.0557 58.2048 34.8295 58.2263 34.5788L61.1337 18.9977L54.6831 22.7794C54.5069 22.8376 54.3074 22.7879 54.1729 22.646C54.0457 22.5129 53.9977 22.3133 54.0622 22.1314L60.1736 4.78497C60.2591 4.54791 60.4989 4.41369 60.7469 4.46756C60.9868 4.52075 61.1549 4.74698 61.1333 4.99768L61.1337 15.5456L65.4578 14.8976C65.6421 14.84 65.8335 14.8891 65.968 15.0309C66.0952 15.1641 66.1432 15.3638 66.0787 15.5456L59.186 34.7915C59.1106 35.005 58.8952 35.1413 58.6768 35.1226L58.6775 35.1145Z" fill="currentColor"></path><path d="M18.0738 34.3732C18.0738 34.3732 18.0277 34.3732 18 34.3732C17.7232 34.3404 17.511 34.1273 17.511 33.8732L19.5 20.8732L13.7841 24.301C15 24.301 13.3597 24.3419 13.1936 24.2108C13.0367 24.0879 12.9629 23.8912 13.0183 23.7027L21 3.37316C21.0738 3.12729 21.3322 2.97156 21.6182 3.00434C21.895 3.03713 22.1072 3.2502 22.1072 3.50426L21 17.8732L25.2159 15.4415C25.4189 15.3677 25.6404 15.4005 25.8065 15.5316C25.9633 15.6545 26.0371 15.8513 25.9817 16.0398L18.6182 34.0044C18.5536 34.2256 18.3229 34.3814 18.0738 34.3814V34.3732Z" fill="currentColor"></path></svg>
    </div>
    <p data-wiggle-target class="btn-stop-motion__p">Stop Motion</p>
  </div>
</a>`,

    css: `.btn-stop-motion {
  pointer-events: auto;
  color: #131313;
  cursor: pointer;
  flex: 0 auto;
  grid-template-rows: auto auto;
  grid-template-columns: 1fr 1fr;
  grid-auto-columns: 1fr;
  padding: .75em 1.5em .75em 1em;
  font-weight: 400;
  line-height: 1;
  text-decoration: none;
  display: inline-block;
  transform: rotate(-1deg);
}

.btn-stop-motion__inner {
  grid-column-gap: .25em;
  grid-row-gap: .25em;
  justify-content: center;
  align-items: center;
  height: 100%;
  display: flex;
}

.btn-stop-motion__back {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
}

.btn-stop-motion__back-svg {
  width: 300%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  max-width: none;
}

.btn-stop-motion__icon {
  color: #ffe224;
  flex-shrink: 0;
  width: 1.5em;
  margin-left: -.25em;
  margin-right: -.25em;
  position: relative;
  overflow: hidden;
}

.before__100 {
  padding-top: 100%;
}

.btn-stop-motion__icon-svg {
  width: auto;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  max-width: none;
}

.btn-stop-motion__p {
  color: #efeeec;
  margin-bottom: 0;
  padding-top: 0;
  font-size: 1em;
  font-weight: 500;
  position: relative;
}

/* --- Sprite Animation --- */

@keyframes sprite {
  to {
    transform: translateX(-100%);
  }
}

[data-sprite] .btn-stop-motion__icon-svg {
  animation: sprite 0.45s steps(4, end) infinite;
}

[data-sprite]:hover .btn-stop-motion__back-svg {
  animation: sprite 0.45s steps(3, end) infinite;
}

/* --- Wiggle Animation --- */

@keyframes wiggle {
  from {
    transform: rotate(1deg);
  }
  to {
    transform: rotate(-1deg);
  }
}

[data-wiggle]:hover [data-wiggle-target] {
  animation: wiggle 0.3s steps(2, end) infinite;
}

/* --- Scale Animation (Extra) --- */

.btn-stop-motion {
  transition: 0.5s cubic-bezier(0.35, 1.75, 0.6, 1);
  transform: scale(1) rotate(0.001deg);
}

.btn-stop-motion:hover {
  transform: scale(1.05) rotate(-1deg);
}`,

    js: ``
  }
};

export default componentName;
