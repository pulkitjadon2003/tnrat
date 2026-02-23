// pages/unauthorized.tsx or app/unauthorized/page.tsx (App Router)
"use client";

import Link from 'next/link'
import Head from 'next/head'

export default function UnauthorizedPage() {
  return (
    <>
      <Head>
        <title>Access Denied - No Permission</title>
        <meta name="description" content="You don't have permission to access this page" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-red-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Access Denied
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              You don't have permission to access this page
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Your current role as Sub-Admin has restricted access to this resource.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-4">
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}