'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function DashboardHeader() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const avatarRef = useRef<HTMLButtonElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  
  // Animation for the menu dropdown
  useEffect(() => {
    if (!menuRef.current) return
    
    if (isMenuOpen) {
      // Animate menu opening
      gsap.set(menuRef.current, { 
        opacity: 0, 
        y: 10, 
        transformOrigin: 'top right',
        pointerEvents: 'all'
      })
      
      gsap.to(menuRef.current, { 
        opacity: 1, 
        y: 0, 
        duration: 0.3, 
        ease: 'power3.out'
      })
    } else {
      // Animate menu closing
      gsap.to(menuRef.current, { 
        opacity: 0, 
        y: 10, 
        duration: 0.2, 
        ease: 'power2.in',
        onComplete: () => {
          gsap.set(menuRef.current, { pointerEvents: 'none' })
        }
      })
    }
  }, [isMenuOpen])
  
  // Header entrance animation
  useEffect(() => {
    if (!headerRef.current || !logoRef.current || !avatarRef.current) return
    
    const tl = gsap.timeline()
    
    // Initial states
    gsap.set([logoRef.current, avatarRef.current], { 
      opacity: 0, 
      y: -20 
    })
    
    gsap.set(headerRef.current, {
      y: -10,
      opacity: 0
    })
    
    // Header animation
    tl.to(headerRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    })
    .to([logoRef.current, avatarRef.current], {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    }, '-=0.2')
    
    return () => {
      tl.kill()
    }
  }, [])
  
  // Function to add hover animations to buttons and links
  const addHoverAnimation = (element: HTMLElement) => {
    element.addEventListener('mouseenter', () => {
      gsap.to(element, { 
        scale: 1.05, 
        duration: 0.3, 
        ease: 'power1.out' 
      })
    })
    
    element.addEventListener('mouseleave', () => {
      gsap.to(element, { 
        scale: 1, 
        duration: 0.3, 
        ease: 'power1.out' 
      })
    })
  }
  
  // Add hover effects to menu items
  useEffect(() => {
    if (!menuRef.current) return
    
    const links = menuRef.current.querySelectorAll('a, button')
    links.forEach(link => addHoverAnimation(link as HTMLElement))
    
    return () => {
      links.forEach(link => {
        link.removeEventListener('mouseenter', () => {})
        link.removeEventListener('mouseleave', () => {})
      })
    }
  }, [isMenuOpen])
  
  return (
    <header ref={headerRef} className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link href="/dashboard" ref={logoRef} className="text-2xl font-bold text-primary-600">
            Family Tree
          </Link>
          
          <div className="relative">
            <button 
              ref={avatarRef}
              className="flex items-center space-x-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || '?'}
              </div>
              <span className="hidden md:inline text-gray-700">{session?.user?.name || session?.user?.email}</span>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div 
              ref={menuRef}
              className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10`}
              style={{ pointerEvents: isMenuOpen ? 'all' : 'none', opacity: 0 }}
            >
              <Link
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Your Profile
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                Settings
              </Link>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setIsMenuOpen(false)
                  signOut({ callbackUrl: '/' })
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 