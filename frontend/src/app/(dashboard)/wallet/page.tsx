"use client";

import { WalletList } from "@/features/wallet/components/WalletList";
import { useWallets } from "@/features/wallet/hooks/useWallets";
import { useLanguage } from "@/context/LanguageContext";

export default function WalletPage() {
    const { data: wallets, isLoading } = useWallets();
    const { t } = useLanguage();

    if (isLoading) {
        return <div>{t.dashboard.page.walletLoading}</div>;
    }

    return <WalletList wallets={wallets} />;
}
