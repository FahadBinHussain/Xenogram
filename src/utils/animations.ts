import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin with GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Fade in animation for elements when they enter the viewport
 */
export const fadeInAnimation = (element: Element, delay: number = 0) => {
  gsap.fromTo(
    element,
    { 
      opacity: 0, 
      y: 50 
    },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      delay, 
      ease: 'power2.out' 
    }
  );
};

/**
 * Stagger animation for multiple elements when they enter the viewport
 */
export const staggerAnimation = (elements: Element[] | NodeListOf<Element>, staggerTime: number = 0.1) => {
  gsap.fromTo(
    elements,
    { 
      opacity: 0, 
      y: 50 
    },
    { 
      opacity: 1, 
      y: 0, 
      duration: 0.6, 
      stagger: staggerTime, 
      ease: 'power2.out' 
    }
  );
};

/**
 * Scale animation for elements
 */
export const scaleAnimation = (element: Element, delay: number = 0) => {
  gsap.fromTo(
    element,
    { 
      scale: 0.8, 
      opacity: 0 
    },
    { 
      scale: 1, 
      opacity: 1, 
      duration: 0.5, 
      delay, 
      ease: 'back.out(1.7)' 
    }
  );
};

/**
 * Create a scroll-triggered animation
 */
export const createScrollAnimation = (
  element: Element,
  animation: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale'
) => {
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none none',
    }
  });

  switch (animation) {
    case 'fadeIn':
      tl.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 0.8 });
      break;
    case 'slideUp':
      tl.fromTo(element, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 });
      break;
    case 'slideLeft':
      tl.fromTo(element, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 });
      break;
    case 'slideRight':
      tl.fromTo(element, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 });
      break;
    case 'scale':
      tl.fromTo(element, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8 });
      break;
  }

  return tl;
}; 