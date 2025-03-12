declare module 'barba.js';
declare module 'jquery';
declare module 'list.js';
declare module '@studio-freight/lenis' {
  export interface LenisOptions {
    duration?: number;
    easing?: (t: number) => number;
    smoothTouch?: boolean;
    touchMultiplier?: number;
    infinite?: boolean;
    gestureDirection?: 'vertical' | 'horizontal';
    mouseMultiplier?: number;
    smooth?: boolean;
    wrapper?: HTMLElement | Window;
    content?: HTMLElement;
    wheelEventsTarget?: HTMLElement | Window;
    eventsTarget?: HTMLElement | Window;
  }

  export default class Lenis {
    constructor(options?: LenisOptions);
    raf(time: number): void;
    scrollTo(target: string | number | HTMLElement, options?: any): void;
    stop(): void;
    start(): void;
    destroy(): void;
  }
}
