"use client";

import { WalletList } from "@/features/wallet/components/WalletList";
import { useWallets } from "@/features/wallet/hooks/useWallets";

export default function WalletPage() {
    const { data: wallets, isLoading } = useWallets();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <WalletList wallets={wallets} />;
}
