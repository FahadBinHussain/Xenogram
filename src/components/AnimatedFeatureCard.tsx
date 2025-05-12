'use client'

import { ReactNode, useRef, useEffect } from 'react'
import gsap from 'gsap'

interface AnimatedFeatureCardProps {
  title: string
  description: string
  icon: ReactNode
}

export default function AnimatedFeatureCard({ title, description, icon }: AnimatedFeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const iconContainerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!cardRef.current || !iconContainerRef.current) return
    
    const card = cardRef.current
    const iconContainer = iconContainerRef.current
    
    // Create hover animation
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -10,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        duration: 0.3,
        ease: 'power2.out'
      })
      
      gsap.to(iconContainer, {
        scale: 1.1,
        duration: 0.4,
        ease: 'back.out(1.7)'
      })
    })
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        duration: 0.3,
        ease: 'power2.out'
      })
      
      gsap.to(iconContainer, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
    
    // Clean up event listeners
    return () => {
      card.removeEventListener('mouseenter', () => {})
      card.removeEventListener('mouseleave', () => {})
    }
  }, [])
  
  return (
    <div 
      ref={cardRef}
      className="flex flex-col items-center text-center bg-white p-8 rounded-lg shadow-md transition-all duration-300"
    >
      <div 
        ref={iconContainerRef}
        className="bg-primary-100 text-primary-700 p-4 rounded-full mb-6"
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
} 