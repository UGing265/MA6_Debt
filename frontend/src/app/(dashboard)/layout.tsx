import React from 'react';
import { Toaster } from 'sonner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFFBEB' }}>
      <div className="p-6">
        {children}
      </div>
      <Toaster />
    </div>
  );
}
