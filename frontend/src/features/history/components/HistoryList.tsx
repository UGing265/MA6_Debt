"use client";

import React from "react";
import { HistoryDto } from "../types/history";
import { Card, CardContent } from "@/components/ui/card";
import { HistoryRow } from "./HistoryRow";

type HistoryListProps = {
  items?: HistoryDto[];
  isLoading: boolean;
  error?: any;
  onRefresh?: () => void | Promise<void>;
};

export const HistoryList: React.FC<HistoryListProps> = ({ items, isLoading, error, onRefresh }) => {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="text-center text-pencil-gray">Loading history...</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="text-red-600">Failed to load history: {String(error)}</CardContent>
      </Card>
    );
  }

  if (!items || items.length === 0) {
    return (
      <Card>
        <CardContent className="text-center text-pencil-gray">No history found</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-2">
        {items.map((it) => (
          <HistoryRow key={it.id} item={it} onRefresh={onRefresh} />
        ))}
      </CardContent>
    </Card>
  );
};

export default HistoryList;
