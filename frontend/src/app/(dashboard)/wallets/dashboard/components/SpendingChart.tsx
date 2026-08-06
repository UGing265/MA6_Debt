import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Cell } from "recharts";
import { formatVnd, cn } from "@/lib/utils";
import { getSpendingStats, SpendingStatsDto, DailySpendingLimitDto } from "@/features/history/api/history";
import { ChevronDown, AlertTriangle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface SpendingChartProps {
  // Option to trigger a refetch from the parent if needed
  refreshTrigger?: number;
  dailyLimit?: DailySpendingLimitDto | null;
}

export const SpendingChart: React.FC<SpendingChartProps> = ({ refreshTrigger = 0, dailyLimit }) => {
  const { t } = useLanguage();
  const [period, setPeriod] = useState<"day" | "month" | "quarter">("day");
  const [limit, setLimit] = useState<number>(15);
  const [data, setData] = useState<SpendingStatsDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const dailyLimitAmount = dailyLimit?.enabled && dailyLimit.limitAmount ? dailyLimit.limitAmount : null;
  const overLimitCount = period === "day" && dailyLimitAmount ? data.filter((d) => d.amount > dailyLimitAmount).length : 0;

  // Synchronize limit defaults when period changes
  useEffect(() => {
    if (period === "day") {
      setLimit(15);
    } else if (period === "month") {
      setLimit(6);
    } else if (period === "quarter") {
      setLimit(4);
    }
  }, [period]);

  // Fetch spending statistics
  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const stats = await getSpendingStats(period, limit);
        if (active) {
          setData(stats);
        }
      } catch (err: any) {
        if (active) {
          setError(err?.message || t.wallets.page.stats.spendingFailedToLoad);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void fetchData();
    return () => {
      active = false;
    };
  }, [period, limit, refreshTrigger]);

  // Helper to format chart labels for cleaner XAxis presentation
  const formatXAxisLabel = (label: string) => {
    if (period === "day") {
      // Input: "2026-07-23" -> Output: "23 Jul"
      try {
        const date = new Date(label);
        return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
      } catch {
        return label;
      }
    }
    if (period === "month") {
      // Input: "2026-07" -> Output: "Jul 26"
      try {
        const [year, month] = label.split("-");
        const date = new Date(Number(year), Number(month) - 1, 1);
        return date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      } catch {
        return label;
      }
    }
    // For quarters, e.g. "2026-Q3" -> just return Q3/26
    if (period === "quarter" && label.includes("-Q")) {
      const [year, q] = label.split("-");
      return `${q}/${year.slice(-2)}`;
    }
    return label;
  };

  const formatText = (template: string, value: string | number) =>
    template.replace("{label}", String(value)).replace("{amount}", String(value)).replace("{count}", String(value));

  const getLimitOptions = () => {
    if (period === "day") {
      return [
        { label: t.wallets.page.stats.spendingLast7Days, value: 7 },
        { label: t.wallets.page.stats.spendingLast15Days, value: 15 },
        { label: t.wallets.page.stats.spendingLast30Days, value: 30 },
      ];
    }
    if (period === "month") {
      return [
        { label: t.wallets.page.stats.spendingLast3Months, value: 3 },
        { label: t.wallets.page.stats.spendingLast6Months, value: 6 },
        { label: t.wallets.page.stats.spendingLast12Months, value: 12 },
      ];
    }
    // quarter
    return [
      { label: t.wallets.page.stats.spendingLast4Quarters, value: 4 },
      { label: t.wallets.page.stats.spendingLast8Quarters, value: 8 },
    ];
  };

type OptionItem = {
  value: number;
  label: string;
};

const ChartRangeDropdown: React.FC<{
  limit: number;
  options: OptionItem[];
  onSelect: (val: number) => void;
}> = ({ limit, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOpt = options.find((o) => o.value === limit);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-xs font-semibold bg-white border border-gray-200 hover:border-gray-300 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer shadow-2xs"
      >
        <span>{selectedOpt?.label ?? `${limit}`}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 text-pencil-gray transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[120px] rounded-xl border border-gray-200 bg-white p-1 shadow-xl space-y-0.5 animate-in fade-in-50 zoom-in-95">
          {options.map((opt) => {
            const isSelected = opt.value === limit;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onSelect(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-lg cursor-pointer flex items-center justify-between transition-colors",
                  isSelected ? "bg-note-yellow font-bold text-ink-black shadow-xs" : "text-ink-black hover:bg-amber-100/50 font-medium"
                )}
              >
                <span>{opt.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

  return (
    <Card className="xl:col-span-2" data-testid="chart-container">
      <CardHeader className="pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-2xl font-bold text-ink-black">{t.wallets.page.stats.spendingAnalysisTitle}</CardTitle>
            {overLimitCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 border border-red-200">
                <AlertTriangle className="h-3.5 w-3.5" />
                {formatText(t.wallets.page.stats.spendingDaysOverLimit, overLimitCount)}
              </span>
            )}
          </div>
          <p className="text-sm text-pencil-gray">{t.wallets.page.stats.spendingAnalysisDescription}</p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Period Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-0.5 border border-gray-200">
            {(["day", "month", "quarter"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all cursor-pointer ${
                  period === p
                    ? "bg-white text-[#D97706] shadow-sm"
                    : "text-pencil-gray hover:text-ink-black"
                }`}
              >
                {p === "day"
                  ? t.wallets.page.stats.spendingDay
                  : p === "month"
                    ? t.wallets.page.stats.spendingMonth
                    : t.wallets.page.stats.spendingQuarter}
              </button>
            ))}
          </div>

          {/* Custom Range Dropdown */}
          <ChartRangeDropdown
            limit={limit}
            options={getLimitOptions()}
            onSelect={(val) => setLimit(val)}
          />
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="h-72 rounded-xl border border-dashed border-note-yellow/30 bg-gray-50/50 animate-pulse flex items-center justify-center">
            <span className="text-xs text-pencil-gray">{t.wallets.page.stats.spendingLoading}</span>
          </div>
        ) : error ? (
          <div className="h-72 rounded-xl border border-dashed border-red-200 bg-red-50/50 flex flex-col items-center justify-center gap-2">
            <p className="text-sm text-red-600 font-semibold">{error}</p>
            <button
              onClick={() => {
                // simple trigger refetch
                setLimit((l) => l);
              }}
              className="text-xs underline text-red-500 hover:text-red-700"
            >
              {t.wallets.page.stats.spendingRetry}
            </button>
          </div>
        ) : data.length === 0 ? (
          <div className="h-72 rounded-xl border border-dashed border-note-yellow/20 bg-gray-50/50 flex flex-col items-center justify-center gap-1">
            <p className="text-sm text-pencil-gray font-semibold">{t.wallets.page.stats.spendingNoData}</p>
            <p className="text-xs text-pencil-gray/60">{t.wallets.page.stats.spendingAnyDebitTransactions}</p>
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 15, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#fcd34d" opacity={0.15} />
                <XAxis
                  dataKey="label"
                  tickFormatter={formatXAxisLabel}
                  tick={{ fill: "#4b5563", fontSize: 11, fontWeight: 500 }}
                  dy={8}
                />
                <YAxis
                  tick={{ fill: "#4b5563", fontSize: 11, fontWeight: 500 }}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                    return value;
                  }}
                  dx={-4}
                />
                <Tooltip
                  formatter={(value, name) => [
                    formatVnd(Number(value)),
                    name === t.wallets.page.stats.spendingSpentAmount ? t.wallets.page.stats.spendingSpentAmount : t.wallets.page.stats.spendingTrend,
                  ]}
                  labelFormatter={(label) => formatText(t.wallets.page.stats.spendingDatePrefix, formatXAxisLabel(String(label)))}
                  contentStyle={{
                    backgroundColor: "#fffbeb",
                    border: "1px solid #fcd34d",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                  labelStyle={{ fontWeight: "bold", color: "#1f2937" }}
                />
                <Legend />
                {period === "day" && dailyLimitAmount ? (
                  <ReferenceLine
                    y={dailyLimitAmount}
                    stroke="#ef4444"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    label={{
                      value: formatText(t.wallets.page.stats.spendingLimitLabel, formatVnd(dailyLimitAmount)),
                      fill: "#ef4444",
                      fontSize: 11,
                      position: "top",
                      fontWeight: 600,
                    }}
                  />
                ) : null}
                <Bar
                  dataKey="amount"
                  name={t.wallets.page.stats.spendingSpentAmount}
                  fill="#f59e0b"
                  opacity={0.85}
                  barSize={period === "day" ? 18 : period === "month" ? 36 : 54}
                  radius={[6, 6, 0, 0]}
                >
                  {data.map((entry, index) => {
                    const isOver = period === "day" && dailyLimitAmount && entry.amount > dailyLimitAmount;
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={isOver ? "#ef4444" : "#f59e0b"}
                        opacity={isOver ? 0.95 : 0.85}
                      />
                    );
                  })}
                </Bar>
                <Line
                  type="monotone"
                  dataKey="amount"
                  name={t.wallets.page.stats.spendingTrend}
                  stroke="#d97706"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#d97706", strokeWidth: 1 }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
