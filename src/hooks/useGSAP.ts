import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Ensure ScrollTrigger is registered
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type AnimationType = 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'stagger';

interface UseGSAPProps {
  animation: AnimationType;
  trigger?: string | null; // CSS selector for trigger element
  start?: string; // ScrollTrigger start position
  scrub?: boolean | number; // Whether to bind animation to scroll position
  delay?: number; // Delay before animation starts
  duration?: number; // Animation duration
  stagger?: number; // Stagger time between elements (for stagger animation)
  once?: boolean; // Whether to play animation only once
  markers?: boolean; // Debug markers for ScrollTrigger
}

/**
 * Custom hook for GSAP animations in React components
 */
export const useGSAP = ({
  animation,
  trigger = null,
  start = 'top 80%',
  scrub = false,
  delay = 0,
  duration = 0.8,
  stagger = 0.1,
  once = true,
  markers = false,
}: UseGSAPProps) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const childrenRef = useRef<HTMLElement[]>([]);
  const animationRef = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null);

  // Helper to create the animation based on type
  const createAnimation = (element: HTMLElement) => {
    let anim;
    
    const getBasicProps = (overrides = {}) => ({
      duration,
      delay,
      ease: 'power2.out',
      ...overrides,
    });

    switch (animation) {
      case 'fadeIn':
        anim = gsap.fromTo(
          element,
          { opacity: 0 },
          getBasicProps({ opacity: 1 })
        );
        break;
      case 'slideUp':
        anim = gsap.fromTo(
          element,
          { opacity: 0, y: 50 },
          getBasicProps({ opacity: 1, y: 0 })
        );
        break;
      case 'slideLeft':
        anim = gsap.fromTo(
          element,
          { opacity: 0, x: -50 },
          getBasicProps({ opacity: 1, x: 0 })
        );
        break;
      case 'slideRight':
        anim = gsap.fromTo(
          element,
          { opacity: 0, x: 50 },
          getBasicProps({ opacity: 1, x: 0 })
        );
        break;
      case 'scale':
        anim = gsap.fromTo(
          element,
          { opacity: 0, scale: 0.8 },
          getBasicProps({ opacity: 1, scale: 1, ease: 'back.out(1.7)' })
        );
        break;
      case 'stagger':
        // For stagger, we handle this differently in the useEffect
        break;
      default:
        anim = gsap.fromTo(
          element,
          { opacity: 0 },
          getBasicProps({ opacity: 1 })
        );
    }

    return anim;
  };

  // Handle set up and clean up of animations
  useEffect(() => {
    let ctx = gsap.context(() => {
      if (!elementRef.current) return;
      
      // Special case for stagger animation
      if (animation === 'stagger' && childrenRef.current.length) {
        animationRef.current = gsap.fromTo(
          childrenRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration,
            stagger,
            delay,
            ease: 'power2.out',
          }
        );
        
        // If we want to trigger on scroll
        if (trigger) {
          const triggerElement = trigger ? document.querySelector(trigger) : elementRef.current;
          if (triggerElement) {
            ScrollTrigger.create({
              trigger: triggerElement,
              start,
              onEnter: () => {
                if (animationRef.current) {
                  (animationRef.current as gsap.core.Tween).play(0);
                }
              },
              markers,
              toggleActions: once ? 'play none none none' : 'play reverse play reverse',
            });
          }
        }
        
        return;
      }
      
      // Regular animations
      const targetElement = trigger ? document.querySelector(trigger) : elementRef.current;
      
      if (!targetElement) return;
      
      if (scrub !== false) {
        // Create timeline for scroll-based animation
        let tl = gsap.timeline({
          scrollTrigger: {
            trigger: targetElement,
            start,
            scrub: scrub,
            markers,
          }
        });
        
        // Add animation to timeline
        if (elementRef.current) {
          switch (animation) {
            case 'fadeIn':
              tl.fromTo(elementRef.current, { opacity: 0 }, { opacity: 1 });
              break;
            case 'slideUp':
              tl.fromTo(elementRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1 });
              break;
            case 'slideLeft':
              tl.fromTo(elementRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1 });
              break;
            case 'slideRight':
              tl.fromTo(elementRef.current, { x: 50, opacity: 0 }, { x: 0, opacity: 1 });
              break;
            case 'scale':
              tl.fromTo(elementRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1 });
              break;
          }
          
          animationRef.current = tl;
        }
      } else {
        // Create standard animation with optional scroll trigger
        animationRef.current = createAnimation(elementRef.current);
        
        if (trigger && animationRef.current) {
          // Manually trigger animation on scroll if trigger is provided
          (animationRef.current as gsap.core.Tween).pause();
          
          ScrollTrigger.create({
            trigger: targetElement,
            start,
            onEnter: () => {
              if (animationRef.current) {
                (animationRef.current as gsap.core.Tween).play();
              }
            },
            markers,
            toggleActions: once ? 'play none none none' : 'play reverse play reverse',
          });
        }
      }
    });
    
    // Cleanup function
    return () => {
      ctx.revert(); // Clean up all GSAP animations created by this context
    };
  }, [animation, trigger, start, scrub, delay, duration, stagger, once, markers]);

  // Setter for childrenRef (used for stagger animations)
  const setChildrenRef = (el: HTMLElement) => {
    if (el && !childrenRef.current.includes(el)) {
      childrenRef.current.push(el);
    }
  };

  return { elementRef, setChildrenRef };
}; 