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
      style={{ backgroundColor: '#F5EBE0' }}
    >
      <div 
        className="w-full max-w-md p-8 rounded-2xl shadow-lg border-2"
        style={{ 
          backgroundColor: '#F5EBE0',
          borderColor: '#FF7A00'
        }}
      >
        {children}
      </div>
      <Toaster />
    </div>
  );
}