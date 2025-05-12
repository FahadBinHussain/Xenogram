'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function ParallaxBackgroundEffect() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!containerRef.current || typeof window === 'undefined') return
    
    const container = containerRef.current
    
    // Create background elements
    for (let i = 0; i < 8; i++) {
      const element = document.createElement('div')
      element.className = 'absolute rounded-full bg-primary-500 opacity-10 blur-3xl'
      
      // Randomize size
      const size = Math.random() * 500 + 200 // between 200px and 700px
      element.style.width = `${size}px`
      element.style.height = `${size}px`
      
      // Randomize position
      element.style.left = `${Math.random() * 100}%`
      element.style.top = `${Math.random() * 100}%`
      
      // Add to container
      container.appendChild(element)
    }
    
    // Animate the elements
    const elements = container.querySelectorAll('div')
    
    elements.forEach((el) => {
      // Create random animation properties for each element
      const xMovement = Math.random() * 200 - 100 // between -100 and 100
      const yMovement = Math.random() * 200 - 100 // between -100 and 100
      const duration = Math.random() * 30 + 30 // between 30 and 60 seconds
      const delay = Math.random() * -30 // random starting point in the animation
      
      // Create infinite loop animation
      gsap.to(el, {
        x: xMovement,
        y: yMovement,
        duration: duration,
        repeat: -1, // infinite repeat
        yoyo: true, // go back and forth
        ease: 'sine.inOut',
        delay: delay,
      })
      
      // Also animate the blur and opacity for added effect
      gsap.to(el, {
        filter: `blur(${Math.random() * 50 + 30}px)`, // between 30px and 80px blur
        opacity: Math.random() * 0.07 + 0.05, // between 0.05 and 0.12 opacity
        duration: Math.random() * 20 + 10, // between 10 and 30 seconds
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * -20,
      })
    })
    
    // Parallax effect on scroll
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const xPos = (clientX / window.innerWidth) - 0.5
      const yPos = (clientY / window.innerHeight) - 0.5
      
      elements.forEach((el, index) => {
        const depth = index * 0.05 + 0.05 // Elements have different movement depths
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
    
    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
  
  return (
    <div 
      ref={containerRef} 
      className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-[-1]"
    ></div>
  )
} 