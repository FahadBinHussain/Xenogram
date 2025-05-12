import Image from 'next/image'
import Link from 'next/link'
import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await auth();
  
  // If user is logged in, redirect to dashboard
  if (session?.user) {
    redirect('/dashboard');
  }
  
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-6 py-24 flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold mb-6">Preserve Your Family's Legacy</h1>
          <p className="text-xl mb-10 max-w-2xl">
            Create, visualize, and share your family tree with a beautiful, 
            easy-to-use platform designed for the modern family historian.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/auth/signin" 
              className="bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-gray-100 transition-colors"
            >
              Get Started
            </Link>
            <Link 
              href="#features" 
              className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Features</h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-100 text-primary-700 p-4 rounded-full mb-6">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Interactive Family Tree</h3>
              <p className="text-gray-600">
                Visualize your family connections with an interactive, draggable tree view that makes understanding relationships intuitive.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-100 text-primary-700 p-4 rounded-full mb-6">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Rich Media Support</h3>
              <p className="text-gray-600">
                Add photos, documents, and stories to each family member's profile to create a living history of your family.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary-100 text-primary-700 p-4 rounded-full mb-6">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Easy Sharing</h3>
              <p className="text-gray-600">
                Share your family tree with relatives through secure access links, allowing collaborative family history research.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-primary-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold text-xl mb-6">1</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Sign Up</h3>
              <p className="text-gray-600">
                Create your free account to get started building your family tree.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-primary-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold text-xl mb-6">2</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Add Family Members</h3>
              <p className="text-gray-600">
                Start with yourself and add relatives, including all important life events and relationships.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="bg-primary-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold text-xl mb-6">3</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Visualize & Share</h3>
              <p className="text-gray-600">
                View your family tree visualization and share it with your relatives to collaborate.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-primary-700 text-white">
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
      </div>

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
    </main>
  )
} 