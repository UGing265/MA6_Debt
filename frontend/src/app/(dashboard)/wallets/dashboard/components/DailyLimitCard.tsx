import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatVnd } from "@/lib/utils";
import type { DailySpendingLimitDto } from "@/features/history/api/history";

interface DailyLimitCardProps {
  dailyLimit: DailySpendingLimitDto | null;
  isLoading: boolean;
  error: string | null;
}

export const DailyLimitCard: React.FC<DailyLimitCardProps> = ({ dailyLimit, isLoading, error }) => {
  if (isLoading) {
    return (
      <Card className="border-note-yellow/30 animate-pulse">
        <CardHeader className="pb-2">
          <div className="h-4 w-32 rounded bg-gray-200" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-40 rounded bg-gray-200" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50/70">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-700">Daily Limit</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-semibold text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!dailyLimit?.enabled || !dailyLimit.limitAmount) {
    return (
      <Card className="border-gray-200 bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-pencil-gray">Daily Limit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-ink-black">Off</div>
          <p className="mt-1 text-xs text-pencil-gray">Turn it on in Settings.</p>
        </CardContent>
      </Card>
    );
  }

  const limitAmount = dailyLimit.limitAmount;
  const spentAmount = dailyLimit.spentAmount;
  const progress = Math.min(100, Math.round((spentAmount / limitAmount) * 100));
  const isOver = (dailyLimit.overAmount ?? 0) > 0;

  return (
    <Card className={isOver ? "border-red-200 bg-red-50/60" : "border-note-yellow/30"}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-pencil-gray">Daily Limit</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={isOver ? "text-3xl font-bold text-red-500" : "text-3xl font-bold text-ink-black"}>
          {isOver ? `Over ${formatVnd(dailyLimit.overAmount ?? 0)}` : `${formatVnd(dailyLimit.remainingAmount ?? 0)} left`}
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className={isOver ? "h-full bg-red-500" : "h-full bg-note-yellow"} style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-2 text-xs font-medium text-pencil-gray">
          Spent {formatVnd(spentAmount)} / {formatVnd(limitAmount)} today
        </p>
      </CardContent>
    </Card>
  );
};
