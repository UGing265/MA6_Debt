import React from 'react';
import Link from 'next/link';
import { Toaster } from 'sonner';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="relative min-h-screen flex flex-col items-center justify-center p-4 font-quicksand"
      style={{ backgroundColor: '#FFFBEB' }}
    >
      {/* Brand Logo & Slogan Header pushed higher up */}
      <div className="sm:absolute sm:top-10 flex flex-col items-center mb-6 sm:mb-0">
        <Link href="/" className="flex flex-col items-center group cursor-pointer">
          <img
            src="/MA6.png"
            alt="MA6 Debt Logo"
            className="h-30 w-30 sm:h-30 sm:w-30 object-contain transition-transform duration-200 group-hover:scale-105"
          />
          <span className="text-xs sm:text-sm font-semibold text-pencil-gray tracking-wide font-quicksand group-hover:text-ink-black transition-colors">
            Track your money, made simple
          </span>
        </Link>
      </div>

      {/* Centered Auth Form Card */}
      <div 
        className="w-full max-w-md p-8 rounded-2xl shadow-lg border z-10 sm:mt-16"
        style={{ 
          backgroundColor: '#FFFDF5',
          borderColor: 'rgba(31, 41, 55, 0.12)'
        }}
      >
        {children}
      </div>
      <Toaster />
    </div>
  );
}
