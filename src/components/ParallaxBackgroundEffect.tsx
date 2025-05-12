'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function ParallaxBackgroundEffect() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return
    
    // Create a GSAP context
    const ctx = gsap.context(() => {
      // Animate the existing background elements
      const elements = containerRef.current?.querySelectorAll('.bg-element')
      
      if (elements?.length) {
        // Create floating animations for each element
        elements.forEach((el, index) => {
          // Create a unique animation for each element
          gsap.to(el, {
            x: Math.sin(index) * 100,
            y: Math.cos(index) * 100,
            duration: 20 + index * 5,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          })
        })
        
        // Create a single mousemove handler for better performance
        const handleMouseMove = (e: MouseEvent) => {
          const xPos = (e.clientX / window.innerWidth) - 0.5
          const yPos = (e.clientY / window.innerHeight) - 0.5
          
          elements.forEach((el, index) => {
            const depth = (index + 1) * 0.05
            
            gsap.to(el, {
              x: xPos * 100 * depth,
              y: yPos * 100 * depth,
              duration: 1,
              ease: 'power1.out'
            })
          })
        }
        
        // Add event listener
        window.addEventListener('mousemove', handleMouseMove)
        
        // Clean up function to remove event listener
        return () => {
          window.removeEventListener('mousemove', handleMouseMove)
        }
      }
    }, containerRef)
    
    // Clean up GSAP context
    return () => ctx.revert()
  }, [])
  
  return (
    <div ref={containerRef} className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Pre-rendered background elements */}
      <div className="bg-element absolute top-[10%] left-[20%] w-[300px] h-[300px] rounded-full bg-primary-600 opacity-10 blur-3xl"></div>
      <div className="bg-element absolute top-[60%] left-[50%] w-[500px] h-[500px] rounded-full bg-primary-500 opacity-5 blur-3xl"></div>
      <div className="bg-element absolute top-[30%] left-[80%] w-[400px] h-[400px] rounded-full bg-indigo-500 opacity-8 blur-3xl"></div>
      <div className="bg-element absolute top-[80%] left-[30%] w-[350px] h-[350px] rounded-full bg-blue-500 opacity-7 blur-3xl"></div>
      <div className="bg-element absolute top-[40%] left-[10%] w-[450px] h-[450px] rounded-full bg-indigo-600 opacity-6 blur-3xl"></div>
      <div className="bg-element absolute top-[20%] left-[60%] w-[250px] h-[250px] rounded-full bg-primary-400 opacity-9 blur-3xl"></div>
    </div>
  )
} 