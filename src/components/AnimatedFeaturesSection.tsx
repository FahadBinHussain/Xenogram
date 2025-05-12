'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedFeatureCard from './AnimatedFeatureCard'

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function AnimatedFeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!sectionRef.current || !headingRef.current || !featuresRef.current) return
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        }
      })
      
      // Animate heading
      tl.fromTo(headingRef.current, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      )
      
      // Animate feature cards in staggered fashion
      const featureCards = featuresRef.current.children
      tl.fromTo(featureCards, 
        { opacity: 0, y: 50 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.15, 
          ease: 'power2.out' 
        }, 
        '-=0.4' // Start slightly before the heading animation finishes
      )
    })
    
    return () => ctx.revert()
  }, [])
  
  return (
    <div ref={sectionRef} id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 ref={headingRef} className="text-4xl font-bold text-center mb-16 text-gray-800">Features</h2>
        
        <div ref={featuresRef} className="grid md:grid-cols-3 gap-12">
          <AnimatedFeatureCard 
            title="Interactive Family Tree" 
            description="Visualize your family connections with an interactive, draggable tree view that makes understanding relationships intuitive."
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
              </svg>
            }
          />
          
          <AnimatedFeatureCard 
            title="Rich Media Support" 
            description="Add photos, documents, and stories to each family member's profile to create a living history of your family."
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path>
              </svg>
            }
          />
          
          <AnimatedFeatureCard 
            title="Easy Sharing" 
            description="Share your family tree with relatives through secure access links, allowing collaborative family history research."
            icon={
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
              </svg>
            }
          />
        </div>
      </div>
    </div>
  )
} 