'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import CreateFamilyTreeButton from './CreateFamilyTreeButton'

export default function AnimatedDashboardIntro() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const buttonWrapperRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!containerRef.current || !titleRef.current || !textRef.current || !buttonWrapperRef.current) return
    
    // Create a GSAP context
    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set([titleRef.current, textRef.current, buttonWrapperRef.current], {
        opacity: 0,
        y: 20
      })
      
      // Create animation timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      
      // Animate elements sequentially
      tl.to(containerRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out'
      })
      .to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6
      })
      .to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6
      }, '-=0.3')
      .to(buttonWrapperRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6
      }, '-=0.3')
    })
    
    // Clean up
    return () => ctx.revert()
  }, [])
  
  return (
    <div 
      ref={containerRef}
      className="bg-white rounded-lg shadow-md p-12 text-center transform transition-all"
      style={{ transform: 'scale(0.95)', opacity: 0.5 }}
    >
      <h2 
        ref={titleRef}
        className="text-2xl font-semibold mb-4 text-gray-800"
      >
        Welcome to Your Family Tree Dashboard
      </h2>
      <p 
        ref={textRef}
        className="text-gray-600 mb-8 max-w-lg mx-auto"
      >
        You haven't created any family trees yet. Get started by creating your first family tree.
      </p>
      <div ref={buttonWrapperRef}>
        <CreateFamilyTreeButton variant="large" />
      </div>
    </div>
  )
} 