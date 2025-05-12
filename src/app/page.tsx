import Link from 'next/link'
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'
import AnimatedHero from '@/components/AnimatedHero'
import AnimatedFeaturesSection from '@/components/AnimatedFeaturesSection'
import ScrollAnimatedSection from '@/components/ScrollAnimatedSection'
import SmoothScroll from '@/components/SmoothScroll'
import AnimatedCursor from '@/components/AnimatedCursor'

export default async function Home() {
  const session = await auth();
  
  // If user is logged in, redirect to dashboard
  if (session?.user) {
    redirect('/dashboard');
  }
  
  return (
    <main className="flex min-h-screen flex-col overflow-hidden">
      {/* Custom Cursor */}
      <AnimatedCursor />
      
      {/* Smooth Scrolling Wrapper */}
      <SmoothScroll>
        {/* Hero Section - Now with animations */}
        <AnimatedHero />

        {/* Features Section - Now with animations */}
        <AnimatedFeaturesSection />

        {/* How It Works Section - Now with scroll animations */}
        <ScrollAnimatedSection
          animation="staggered"
          className="py-24 bg-gray-50"
        >
          <div className="container mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md" data-speed="0.8">
                <div className="bg-primary-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold text-xl mb-6">1</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Sign Up</h3>
                <p className="text-gray-600">
                  Create your free account to get started building your family tree.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md" data-speed="1">
                <div className="bg-primary-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold text-xl mb-6">2</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Add Family Members</h3>
                <p className="text-gray-600">
                  Start with yourself and add relatives, including all important life events and relationships.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md" data-speed="1.2">
                <div className="bg-primary-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold text-xl mb-6">3</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Visualize & Share</h3>
                <p className="text-gray-600">
                  View your family tree visualization and share it with your relatives to collaborate.
                </p>
              </div>
            </div>
          </div>
        </ScrollAnimatedSection>

        {/* CTA Section - With scroll animation */}
        <ScrollAnimatedSection
          animation="slideUp"
          className="py-24 bg-primary-700 text-white"
        >
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold mb-8">Start Your Family Tree Today</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto">
              Begin documenting your family's legacy for future generations.
            </p>
            <Link 
              href="/auth/signin" 
              className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-gray-100 transition-colors"
            >
              Get Started for Free
            </Link>
          </div>
        </ScrollAnimatedSection>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-8 md:mb-0">
                <h3 className="text-2xl font-bold mb-2">Family Tree</h3>
                <p className="text-gray-400">Preserving your family's legacy</p>
              </div>
              <div className="flex flex-col md:flex-row gap-8">
                <div>
                  <h4 className="font-semibold mb-4">Product</h4>
                  <ul className="space-y-2">
                    <li><Link href="#features" className="text-gray-400 hover:text-white transition-colors">Features</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Company</h4>
                  <ul className="space-y-2">
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Legal</h4>
                  <ul className="space-y-2">
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</Link></li>
                    <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms</Link></li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>© {new Date().getFullYear()} Family Tree. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </SmoothScroll>
    </main>
  )
} 