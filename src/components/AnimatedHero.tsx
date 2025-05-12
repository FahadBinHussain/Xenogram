'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function AnimatedHero() {
  const heroRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const buttonContainerRef = useRef<HTMLDivElement>(null)
  const waveRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Create a GSAP context to make cleanup easier
    const ctx = gsap.context(() => {
      // Initial setup: ensure everything is invisible
      if (titleRef.current && descriptionRef.current && buttonContainerRef.current && waveRef.current) {
        gsap.set([titleRef.current, descriptionRef.current, buttonContainerRef.current], { 
          opacity: 0,
          y: 50
        });
        
        gsap.set(waveRef.current, { 
          opacity: 0,
        });
        
        // Create animation timeline
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        
        // Animate the elements sequentially
        tl.to(titleRef.current, { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          delay: 0.2 
        })
        .to(descriptionRef.current, { 
          opacity: 1, 
          y: 0, 
          duration: 0.8 
        }, '-=0.4') // Start slightly before previous animation ends
        .to(buttonContainerRef.current, { 
          opacity: 1, 
          y: 0, 
          duration: 0.8 
        }, '-=0.4')
        .to(waveRef.current, { 
          opacity: 1, 
          duration: 0.8 
        }, '-=0.2');
        
        // Add hover animation for buttons
        const buttons = buttonContainerRef.current.querySelectorAll('a');
        
        buttons.forEach(button => {
          button.addEventListener('mouseenter', () => {
            gsap.to(button, { 
              scale: 1.05, 
              duration: 0.3, 
              ease: 'back.out(1.7)' 
            });
          });
          
          button.addEventListener('mouseleave', () => {
            gsap.to(button, { 
              scale: 1, 
              duration: 0.3, 
              ease: 'power2.out' 
            });
          });
        });
      }
    }, heroRef); // Scope all selectors to the heroRef element
    
    // Clean up function
    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative bg-gradient-to-b from-primary-600 to-primary-800 text-white">
      <div className="container mx-auto px-6 py-24 flex flex-col items-center text-center">
        <h1 ref={titleRef} className="text-5xl font-bold mb-6">
          Preserve Your Family's Legacy
        </h1>
        <p ref={descriptionRef} className="text-xl mb-10 max-w-2xl">
          Create, visualize, and share your family tree with a beautiful, 
          easy-to-use platform designed for the modern family historian.
        </p>
        <div ref={buttonContainerRef} className="flex gap-4">
          <Link 
            href="/auth/signin" 
            className="bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
          <Link 
            href="#features" 
            className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
      <div 
        ref={waveRef} 
        className="absolute bottom-0 left-0 right-0 h-16 bg-white" 
        style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}
      ></div>
    </div>
  )
} 