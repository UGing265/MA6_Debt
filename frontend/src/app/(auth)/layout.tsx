import React from 'react';
import { Toaster } from 'sonner';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--paper-cream)' }}>
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        {children}
      </div>
      <Toaster />
    </div>
  );
}
