'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function AnimatedCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const followerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Make sure we're on the client side
    if (typeof window === 'undefined') return
    
    const cursor = cursorRef.current
    const follower = followerRef.current
    
    if (!cursor || !follower) return
    
    // Hide cursor initially
    gsap.set([cursor, follower], { xPercent: -50, yPercent: -50, scale: 0, opacity: 0 })
    
    // Create animation showing the cursor
    gsap.to([cursor, follower], { 
      duration: 0.5, 
      scale: 1, 
      opacity: 1, 
      ease: 'power2.out', 
      stagger: 0.1,
      delay: 0.3
    })
    
    // Mouse move handler
    const onMouseMove = (e: MouseEvent) => {
      // Animate the cursor position
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power1.out'
      })
      
      // Animate the follower with a slight delay for trailing effect
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out'
      })
    }
    
    // Detect interactive elements
    const onMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      if (target instanceof Element && (target.tagName === 'A' || 
          target.tagName === 'BUTTON' || 
          target.closest('a') || 
          target.closest('button') ||
          target.classList.contains('interactive'))) {
        
        gsap.to(cursor, {
          scale: 1.5,
          duration: 0.3,
          ease: 'power2.out'
        })
        
        gsap.to(follower, {
          scale: 2,
          opacity: 0.2,
          duration: 0.3,
          ease: 'power2.out'
        })
      }
    }
    
    const onMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      if (target instanceof Element && (target.tagName === 'A' || 
          target.tagName === 'BUTTON' || 
          target.closest('a') || 
          target.closest('button') ||
          target.classList.contains('interactive'))) {
        
        gsap.to(cursor, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        })
        
        gsap.to(follower, {
          scale: 1,
          opacity: 0.5,
          duration: 0.3,
          ease: 'power2.out'
        })
      }
    }
    
    // Add event listeners
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseenter', onMouseEnter, true)
    document.addEventListener('mouseleave', onMouseLeave, true)
    
    // Clean up
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseenter', onMouseEnter, true)
      document.removeEventListener('mouseleave', onMouseLeave, true)
    }
  }, [])
  
  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed w-6 h-6 bg-primary-500 rounded-full pointer-events-none z-[9999] mix-blend-difference"
        style={{ opacity: 0.7 }}
      ></div>
      <div 
        ref={followerRef} 
        className="fixed w-12 h-12 bg-primary-300 rounded-full pointer-events-none z-[9998]"
        style={{ opacity: 0.3 }}
      ></div>
    </>
  )
} 