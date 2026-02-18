import React from 'react';
import { AlertCircle, Lock } from 'lucide-react';

export default function AuthRequired() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <Lock className="w-10 h-10 text-blue-600" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold text-slate-900 text-center mb-3">
            Authentication Required
          </h1>
          
          {/* Description */}
          <p className="text-slate-600 text-center mb-8">
            You need to be signed in to access this page. Please log in to your account to continue.
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <a
              href="/"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-center"
            >
              Log In
            </a>
            
            <a
              href="/signup"
              className="block w-full bg-white hover:bg-slate-50 text-slate-700 font-medium py-3 px-4 rounded-lg border-2 border-slate-200 transition-colors duration-200 text-center"
            >
              Create Account
            </a>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500 text-center">
              Need help?{' '}
              <a href="/support" className="text-blue-600 hover:text-blue-700 font-medium">
                Contact Support
              </a>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <p className="text-center text-sm text-slate-500 mt-6">
          By continuing, you agree to our{' '}
          <a href="/terms" className="text-slate-700 hover:text-slate-900 underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-slate-700 hover:text-slate-900 underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}