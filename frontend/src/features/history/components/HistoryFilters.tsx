"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useHistoryQueryState } from "../hooks/useHistoryQueryState";
import { useWallets } from "../../wallet/hooks/useWallets";

export const HistoryFilters: React.FC = () => {
  const { currentSearch, currentWalletId, setSearch, setWalletId } = useHistoryQueryState();
  const { data: wallets } = useWallets();

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onWalletChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWalletId(e.target.value);
  };

  return (
    <Card className="mb-4">
      <CardContent className="flex items-center gap-4 p-4">
        <Input
          placeholder="Tìm theo ghi chú, partner..."
          value={currentSearch ?? ""}
          onChange={onSearchChange}
          aria-label="Tìm kiếm"
        />
        <select
          className="ml-auto rounded border border-gray-200 p-2"
          value={currentWalletId ?? ""}
          onChange={onWalletChange}
          aria-label="Lọc theo ví"
        >
          <option value="">Tất cả ví</option>
          {wallets?.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
      </CardContent>
    </Card>
  );
};

export default HistoryFilters;
