'use client'

import { signIn, useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function SignInPage() {
  const { data: session, status } = useSession()

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