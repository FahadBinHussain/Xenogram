'use client'

import { ReactNode, useEffect, useRef } from 'react'
import gsap from 'gsap'

interface SmoothScrollProps {
  children: ReactNode
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    // Only execute on client side
    if (typeof window === 'undefined') return
    
    // Dynamically import the ScrollSmoother plugin
    const initScrollSmoother = async () => {
      if (!wrapperRef.current || !contentRef.current) return
      
      const { ScrollSmoother, ScrollTrigger } = await import('gsap/all')
      
      // Register plugins
      gsap.registerPlugin(ScrollSmoother, ScrollTrigger)
      
      // Create ScrollSmoother instance
      const smoother = ScrollSmoother.create({
        wrapper: wrapperRef.current,
        content: contentRef.current,
        smooth: 1.5, // Higher values create slower scrolling
        effects: true, // Enable scrolling effects for [data-speed] attributes
        normalizeScroll: true, // Prevents page jumping when refreshing
        smoothTouch: 0.1, // Lower value for touch devices
      })
      
      // Clean up function
      return () => {
        if (smoother) smoother.kill()
      }
    }
    
    const cleanup = initScrollSmoother()
    
    return () => {
      cleanup.then(cleanupFn => {
        if (cleanupFn) cleanupFn()
      })
    }
  }, [])
  
  return (
    <div ref={wrapperRef} className="smooth-wrapper" id="smooth-wrapper">
      <div ref={contentRef} className="smooth-content" id="smooth-content">
        {children}
      </div>
    </div>
  )
} 