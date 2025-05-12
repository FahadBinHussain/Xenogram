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
  
  // Split text animation
  useEffect(() => {
    if (!titleRef.current || typeof window === 'undefined') return
    
    const title = titleRef.current
    const originalText = title.textContent || ''
    const words = originalText.split(' ')
    
    // Clear the original text
    title.textContent = ''
    
    // Create spans for each word
    words.forEach((word, i) => {
      const wordSpan = document.createElement('span')
      wordSpan.className = 'inline-block'
      
      // Create spans for each letter
      word.split('').forEach((letter) => {
        const letterSpan = document.createElement('span')
        letterSpan.className = 'inline-block opacity-0 transform translate-y-8'
        letterSpan.textContent = letter
        wordSpan.appendChild(letterSpan)
      })
      
      title.appendChild(wordSpan)
      
      // Add space between words (except for last word)
      if (i < words.length - 1) {
        const space = document.createElement('span')
        space.textContent = ' '
        title.appendChild(space)
      }
    })
    
    // Animate each letter
    const letters = title.querySelectorAll('span > span')
    
    gsap.to(letters, {
      y: 0,
      opacity: 1,
      duration: 0.05,
      stagger: 0.03,
      ease: 'power2.out',
      delay: 0.3
    })
    
    // Gradient animation
    if (heroRef.current) {
      const hero = heroRef.current
      
      // Create dynamic gradient animation
      gsap.to(hero, {
        backgroundPosition: '100% 100%',
        duration: 15,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })
    }
  }, [])

  useEffect(() => {
    // Create a GSAP context to make cleanup easier
    const ctx = gsap.context(() => {
      // Initial setup: ensure everything is invisible
      if (descriptionRef.current && buttonContainerRef.current && waveRef.current) {
        gsap.set([descriptionRef.current, buttonContainerRef.current], { 
          opacity: 0,
          y: 50
        });
        
        gsap.set(waveRef.current, { 
          opacity: 0,
          scaleX: 0.8
        });
        
        // Create animation timeline
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        
        // Animate the elements sequentially
        tl.to(descriptionRef.current, { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          delay: 0.8 // Delay to wait for letter animation to finish
        })
        .to(buttonContainerRef.current, { 
          opacity: 1, 
          y: 0, 
          duration: 0.8 
        }, '-=0.4') // Start slightly before previous animation ends
        .to(waveRef.current, { 
          opacity: 1,
          scaleX: 1, 
          duration: 1.2,
          ease: 'elastic.out(1, 0.75)'
        }, '-=0.2');
        
        // Add hover animation for buttons
        const buttons = buttonContainerRef.current.querySelectorAll('a');
        
        buttons.forEach(button => {
          // Create a container for the animation
          const buttonBg = document.createElement('span')
          buttonBg.className = 'absolute inset-0 bg-white rounded-lg -z-10 transform origin-left'
          buttonBg.style.transform = 'scaleX(0)'
          
          if (button.classList.contains('border')) {
            // This is the secondary button
            button.style.position = 'relative'
            button.appendChild(buttonBg)
            
            button.addEventListener('mouseenter', () => {
              gsap.to(button, { 
                color: '#4338CA', // Primary color
                duration: 0.3,
                ease: 'power2.out'
              })
              
              gsap.to(buttonBg, {
                scaleX: 1,
                duration: 0.4,
                ease: 'power2.out'
              })
            })
            
            button.addEventListener('mouseleave', () => {
              gsap.to(button, { 
                color: 'white',
                duration: 0.3, 
                ease: 'power2.out' 
              })
              
              gsap.to(buttonBg, {
                scaleX: 0,
                duration: 0.4,
                ease: 'power2.in'
              })
            })
          } else {
            // This is the primary button
            button.addEventListener('mouseenter', () => {
              gsap.to(button, { 
                scale: 1.05, 
                y: -3,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                duration: 0.3, 
                ease: 'back.out(1.7)' 
              });
            });
            
            button.addEventListener('mouseleave', () => {
              gsap.to(button, { 
                scale: 1,
                y: 0,
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                duration: 0.3, 
                ease: 'power2.out' 
              });
            });
          }
        });
      }
    }, heroRef); // Scope all selectors to the heroRef element
    
    // Clean up function
    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={heroRef} 
      className="relative text-white overflow-hidden"
      style={{ 
        background: 'linear-gradient(-45deg, #4338CA, #3B82F6, #8B5CF6, #6366F1)',
        backgroundSize: '400% 400%',
        backgroundPosition: '0% 0%'
      }}
    >
      <div className="container mx-auto px-6 py-24 flex flex-col items-center text-center">
        <h1 ref={titleRef} className="text-5xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
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
            className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors relative overflow-hidden"
          >
            Learn More
          </Link>
        </div>
      </div>
      <div 
        ref={waveRef} 
        className="absolute bottom-0 left-0 right-0 h-20 bg-white" 
        style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 25%, 75% 50%, 50% 25%, 25% 50%, 0 25%)' }}
      ></div>
    </div>
  )
} 