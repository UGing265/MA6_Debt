using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Transactions.GetSpendingStats
{
    public class GetSpendingStatsQueryHandler : IRequestHandler<GetSpendingStatsQuery, List<SpendingStatsDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetSpendingStatsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<SpendingStatsDto>> Handle(GetSpendingStatsQuery request, CancellationToken cancellationToken)
        {
            var nowUtc = DateTime.UtcNow;
            var nowLocal = nowUtc.AddHours(7); // UTC+7 timezone conversion

            DateTime startLocal;
            DateTime startDateUtc;

            // 1. Calculate query range based on period and limit in local timezone
            if (request.Period.ToLower() == "month")
            {
                startLocal = new DateTime(nowLocal.Year, nowLocal.Month, 1).AddMonths(-(request.Limit - 1));
            }
            else if (request.Period.ToLower() == "quarter")
            {
                var currentQuarterStartMonth = ((nowLocal.Month - 1) / 3) * 3 + 1;
                var currentQuarterStartLocal = new DateTime(nowLocal.Year, currentQuarterStartMonth, 1);
                startLocal = currentQuarterStartLocal.AddMonths(-(request.Limit - 1) * 3);
            }
            else // Default to daily
            {
                startLocal = new DateTime(nowLocal.Year, nowLocal.Month, nowLocal.Day).AddDays(-(request.Limit - 1));
            }

            startDateUtc = DateTime.SpecifyKind(startLocal.AddHours(-7), DateTimeKind.Utc);

            // 2. Fetch all raw negative transactions (expenses) in range
            var transactions = await _context.Transactions
                .AsNoTracking()
                .Include(t => t.Wallet)
                .Where(t => t.Wallet.UserId == request.UserId)
                .Where(t => t.TransactionDate >= startDateUtc)
                .Where(t => t.Amount < 0)
                .ToListAsync(cancellationToken);

            // 3. Filter out internal transfers (notes starting with "Transfer to ")
            var expenses = transactions
                .Where(t => t.Note == null || !t.Note.StartsWith("Transfer to ", StringComparison.OrdinalIgnoreCase))
                .ToList();

            // 4. Pre-populate chronological intervals and group
            var statsDict = new Dictionary<string, decimal>();

            if (request.Period.ToLower() == "month")
            {
                for (int i = 0; i < request.Limit; i++)
                {
                    var m = startLocal.AddMonths(i).ToString("yyyy-MM");
                    statsDict[m] = 0;
                }

                foreach (var t in expenses)
                {
                    var localDate = t.TransactionDate.AddHours(7);
                    var monthStr = localDate.ToString("yyyy-MM");
                    if (statsDict.ContainsKey(monthStr))
                    {
                        statsDict[monthStr] += Math.Abs(t.Amount);
                    }
                }
            }
            else if (request.Period.ToLower() == "quarter")
            {
                for (int i = 0; i < request.Limit; i++)
                {
                    var q = GetQuarterLabel(startLocal.AddMonths(i * 3));
                    statsDict[q] = 0;
                }

                foreach (var t in expenses)
                {
                    var localDate = t.TransactionDate.AddHours(7);
                    var qStr = GetQuarterLabel(localDate);
                    if (statsDict.ContainsKey(qStr))
                    {
                        statsDict[qStr] += Math.Abs(t.Amount);
                    }
                }
            }
            else // "day"
            {
                for (int i = 0; i < request.Limit; i++)
                {
                    var d = startLocal.AddDays(i).ToString("yyyy-MM-dd");
                    statsDict[d] = 0;
                }

                foreach (var t in expenses)
                {
                    var localDate = t.TransactionDate.AddHours(7);
                    var dateStr = localDate.ToString("yyyy-MM-dd");
                    if (statsDict.ContainsKey(dateStr))
                    {
                        statsDict[dateStr] += Math.Abs(t.Amount);
                    }
                }
            }

            // 5. Convert to sorted DTO list
            return statsDict
                .Select(kvp => new SpendingStatsDto
                {
                    Label = kvp.Key,
                    Amount = kvp.Value
                })
                .ToList();
        }

        private string GetQuarterLabel(DateTime date)
        {
            var quarter = ((date.Month - 1) / 3) + 1;
            return $"{date.Year}-Q{quarter}";
        }
    }
}
