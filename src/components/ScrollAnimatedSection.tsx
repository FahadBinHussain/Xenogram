'use client'

import { ReactNode, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

type AnimationType = 'fadeIn' | 'slideUp' | 'slideIn' | 'staggered' | 'scale'

interface ScrollAnimatedSectionProps {
  children: ReactNode
  animation?: AnimationType
  delay?: number
  duration?: number
  staggerDelay?: number
  className?: string
  threshold?: number // Value between 0 and 1, where in the viewport to trigger (0 = top, 1 = bottom)
}

export default function ScrollAnimatedSection({
  children,
  animation = 'fadeIn',
  delay = 0.1,
  duration = 0.8,
  staggerDelay = 0.1,
  className = '',
  threshold = 0.2
}: ScrollAnimatedSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const childrenRef = useRef<(HTMLElement | null)[]>([])
  
  useEffect(() => {
    // Don't run on server
    if (typeof window === 'undefined') return
    
    // Create GSAP context to properly clean up animations later
    const ctx = gsap.context(() => {
      if (!sectionRef.current) return
      
      const section = sectionRef.current
      let elements = []
      
      // Determine which elements to animate
      if (animation === 'staggered') {
        // For staggered animation, we use the direct children
        elements = Array.from(section.children) as HTMLElement[]
      } else {
        // For other animations, we animate the entire section
        elements = [section]
      }
      
      // Initial state
      switch (animation) {
        case 'fadeIn':
          gsap.set(section, { opacity: 0 })
          break
          
        case 'slideUp':
          gsap.set(section, { opacity: 0, y: 50 })
          break
          
        case 'slideIn':
          gsap.set(section, { opacity: 0, x: -50 })
          break
          
        case 'scale':
          gsap.set(section, { opacity: 0, scale: 0.9 })
          break
          
        case 'staggered':
          gsap.set(elements, { opacity: 0, y: 30 })
          break
      }
      
      // Create the animation timeline
      const tl = gsap.timeline({
        paused: true,
        defaults: { 
          ease: 'power2.out',
          duration: duration
        }
      })
      
      // Build the timeline based on animation type
      switch (animation) {
        case 'fadeIn':
          tl.to(section, { opacity: 1, delay })
          break
          
        case 'slideUp':
          tl.to(section, { opacity: 1, y: 0, delay })
          break
          
        case 'slideIn':
          tl.to(section, { opacity: 1, x: 0, delay })
          break
          
        case 'scale':
          tl.to(section, { opacity: 1, scale: 1, delay, ease: 'back.out(1.7)' })
          break
          
        case 'staggered':
          tl.to(elements, { 
            opacity: 1, 
            y: 0, 
            stagger: staggerDelay,
            delay 
          })
          break
      }
      
      // Create scroll trigger
      ScrollTrigger.create({
        trigger: section,
        start: `top ${threshold * 100}%`,
        onEnter: () => {
          tl.play()
        },
        // Uncomment these to make the animation reset when scrolling back up
        // onLeaveBack: () => {
        //   tl.reverse()
        // },
        // once: false
      })
    })
    
    // Clean up function to prevent memory leaks
    return () => {
      ctx.revert()
    }
  }, [animation, delay, duration, staggerDelay, threshold])
  
  return (
    <div ref={sectionRef} className={className}>
      {children}
    </div>
  )
} 