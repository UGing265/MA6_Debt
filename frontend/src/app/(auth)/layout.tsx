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
      style={{ backgroundColor: '#F5EFE6' }}
    >
      <div 
        className="w-full max-w-md p-8 rounded-2xl shadow-lg border"
        style={{ 
          backgroundColor: '#FFFFFF',
          borderColor: 'rgba(74, 44, 42, 0.1)'
        }}
      >
        {children}
      </div>
      <Toaster />
    </div>
  );
}