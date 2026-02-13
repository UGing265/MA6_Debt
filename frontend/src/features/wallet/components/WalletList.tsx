export const WalletList = () => {
    // Mock data - sau này sẽ fetch từ API
    const wallets = [
        { id: 1, name: "Ví Tiền Mặt", balance: "5.000.000 đ" },
        { id: 2, name: "Ví Ngân Hàng", balance: "12.000.000 đ" },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Danh sách Ví của bạn</h1>
            <div className="grid gap-4">
                {wallets.map((wallet) => (
                    <div key={wallet.id} className="p-4 border rounded shadow-sm flex justify-between">
                        <span className="font-medium">{wallet.name}</span>
                        <span className="text-green-600 font-bold">{wallet.balance}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
