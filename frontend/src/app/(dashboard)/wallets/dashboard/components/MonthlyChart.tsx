import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatVnd } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import type { MonthlyStatsDto } from "@/features/history/api/history";

interface MonthlyChartProps {
  monthlyStats: MonthlyStatsDto[];
  isLoading: boolean;
}

export const MonthlyChart: React.FC<MonthlyChartProps> = ({ monthlyStats, isLoading }) => {
  const { t } = useLanguage();

  return (
    <Card className="xl:col-span-2" data-testid="chart-container">
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl font-bold text-ink-black">{t.wallets.page.stats.monthlyOverviewTitle}</CardTitle>
        <p className="text-sm text-pencil-gray">{t.wallets.page.stats.monthlyOverviewDescription}</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-72 rounded-md border border-note-yellow/20 bg-gray-50 animate-pulse" />
        ) : monthlyStats.length === 0 ? (
          <div className="h-72 rounded-md border border-note-yellow/20 bg-gray-50 flex flex-col items-center justify-center gap-2">
            <p className="text-pencil-gray">{t.wallets.page.stats.monthlyNoData}</p>
            <p className="text-xs text-pencil-gray/60">{t.wallets.page.stats.monthlyRestartHint}</p>
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fcd34d" opacity={0.3} />
                <XAxis dataKey="monthLabel" tick={{ fill: "#374151", fontSize: 12 }} />
                <YAxis
                  tick={{ fill: "#374151", fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  formatter={(value) => formatVnd(Number(value))}
                  labelStyle={{ color: "#1f2937" }}
                  contentStyle={{
                    backgroundColor: "#fffbeb",
                    border: "1px solid #fcd34d",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="expense" name={t.wallets.page.stats.expense} fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="income" name={t.wallets.page.stats.income} fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="debtIncrease" name={t.wallets.page.stats.newDebt} fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="debtDecrease" name={t.wallets.page.stats.repaid} fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
