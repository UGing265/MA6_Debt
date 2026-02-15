import React from 'react';
import { Toaster } from 'sonner';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 font-quicksand"
      style={{ backgroundColor: '#FFFBEB' }}
    >
      <div 
        className="w-full max-w-md p-8 rounded-2xl shadow-lg border"
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
