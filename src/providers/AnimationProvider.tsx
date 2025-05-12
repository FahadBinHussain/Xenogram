'use client'

import { ReactNode, createContext, useContext, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'

type AnimationContextType = {
  isAnimating: boolean
}

const AnimationContext = createContext<AnimationContextType>({
  isAnimating: false
})

export const useAnimation = () => useContext(AnimationContext)

interface AnimationProviderProps {
  children: ReactNode
}

export function AnimationProvider({ children }: AnimationProviderProps) {
  const pathname = usePathname()
  
  useEffect(() => {
    // Create a page transition overlay
    const overlay = document.createElement('div')
    overlay.id = 'page-transition-overlay'
    overlay.style.position = 'fixed'
    overlay.style.top = '0'
    overlay.style.left = '0'
    overlay.style.width = '100%'
    overlay.style.height = '100%'
    overlay.style.backgroundColor = '#ffffff'
    overlay.style.zIndex = '9999'
    overlay.style.pointerEvents = 'none'
    overlay.style.transform = 'translateY(100%)'
    document.body.appendChild(overlay)
    
    // Create animation for page transitions
    const pageTl = gsap.timeline({ paused: true })
    
    pageTl
      .to(overlay, {
        y: 0,
        duration: 0.5,
        ease: 'power4.inOut'
      })
      .to(overlay, {
        y: '-100%',
        duration: 0.5,
        ease: 'power4.inOut',
        delay: 0.1
      })
    
    // Play animation when pathname changes
    pageTl.play()
    
    // Clean up
    return () => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay)
      }
    }
  }, [pathname])
  
  // Preload important GSAP plugins on client side
  useEffect(() => {
    // Import GSAP plugins dynamically on client side
    const loadPlugins = async () => {
      if (typeof window !== 'undefined') {
        const { ScrollTrigger, ScrollSmoother } = await import('gsap/all')
        gsap.registerPlugin(ScrollTrigger, ScrollSmoother)
      }
    }
    
    loadPlugins()
  }, [])
  
  return (
    <AnimationContext.Provider value={{ isAnimating: false }}>
      {children}
    </AnimationContext.Provider>
  )
} 