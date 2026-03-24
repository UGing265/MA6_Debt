import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatVnd } from "@/lib/utils";
import type { MonthlyStatsDto } from "@/features/history/api/history";

interface MonthlyChartProps {
  monthlyStats: MonthlyStatsDto[];
  isLoading: boolean;
}

export const MonthlyChart: React.FC<MonthlyChartProps> = ({ monthlyStats, isLoading }) => {
  return (
    <Card className="xl:col-span-2" data-testid="chart-container">
      <CardHeader className="pb-2">
        <CardTitle className="text-3xl font-bold text-ink-black">Monthly Overview</CardTitle>
        <p className="text-sm text-pencil-gray">Expenses and debt activity over the last 6 months</p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-72 rounded-md border border-note-yellow/20 bg-gray-50 animate-pulse" />
        ) : monthlyStats.length === 0 ? (
          <div className="h-72 rounded-md border border-note-yellow/20 bg-gray-50 flex flex-col items-center justify-center gap-2">
            <p className="text-pencil-gray">No data available</p>
            <p className="text-xs text-pencil-gray/60">Make sure backend API is running and restarted</p>
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
                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="debtIncrease" name="New Debt" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="debtDecrease" name="Repaid" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
