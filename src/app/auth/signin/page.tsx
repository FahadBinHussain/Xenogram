'use client'

import { signIn, useSession } from 'next-auth/react'
import { redirect, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SignInPage() {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const [authError, setAuthError] = useState<string | null>(null)

  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      console.error('Sign-in error from NextAuth:', error)
      
      // Store the error message to display it to the user
      setAuthError(error)
      
      // Log all search params for debugging
      console.log('All search params:', Object.fromEntries(searchParams.entries()))
    }
  }, [searchParams])

  useEffect(() => {
    if (status === 'authenticated') {
      redirect('/dashboard')
    }
  }, [status])

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">Sign In</h1>
        
        {authError && (
          <div className="mb-6 rounded-md bg-red-50 p-4 text-red-800 border border-red-200">
            <p className="font-medium">Authentication Error</p>
            <p className="text-sm">Error code: {authError}</p>
            <p className="text-sm mt-2">
              This may be due to a configuration issue with the OAuth provider. 
              Please check that the callback URL is properly configured.
            </p>
          </div>
        )}
        
        <p className="mb-8 text-center text-gray-600">
          Sign in to access your family tree dashboard.
        </p>
        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="mb-4 flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-3 font-semibold text-white shadow-md hover:bg-red-700 transition-colors duration-300 ease-in-out"
        >
          {/* Replace with Google Icon if available */}
          <span className="mr-2">G</span> Sign in with Google
        </button>
        {/* You can add more providers here if configured */}
      </div>
    </div>
  )
} 