import React from 'react';
import { Toaster } from 'sonner';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFBEB]">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        {children}
      </div>
      <Toaster />
    </div>
  );
}
