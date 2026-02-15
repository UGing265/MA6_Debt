import React from 'react';

export default function WalletDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Wallet Detail - {params.id}</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-600">Wallet details for ID: {params.id}</p>
      </div>
    </div>
  );
}
