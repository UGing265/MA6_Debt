import React from 'react';
import { Toaster } from 'sonner';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#FFFBEB' }}
    >
      <div 
        className="w-full max-w-md p-8 rounded-2xl shadow-lg border-2"
        style={{ 
          backgroundColor: '#FFFEF5',
          borderColor: '#F0D25D'
        }}
      >
        {children}
      </div>
      <Toaster />
    </div>
  );
}