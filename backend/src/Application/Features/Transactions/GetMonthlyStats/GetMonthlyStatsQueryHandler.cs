using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Transactions.GetMonthlyStats
{
    public class GetMonthlyStatsQueryHandler : IRequestHandler<GetMonthlyStatsQuery, List<MonthlyStatsDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetMonthlyStatsQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<MonthlyStatsDto>> Handle(GetMonthlyStatsQuery request, CancellationToken cancellationToken)
        {
            var now = DateTime.UtcNow;
            var startDate = DateTime.SpecifyKind(
                new DateTime(now.Year, now.Month, 1).AddMonths(-(request.Months - 1)),
                DateTimeKind.Utc
            );

            // Get all transactions for the user in the date range
            var transactions = await _context.Transactions
                .AsNoTracking()
                .Include(t => t.Wallet)
                .Where(t => t.Wallet.UserId == request.UserId)
                .Where(t => t.TransactionDate >= startDate)
                .ToListAsync(cancellationToken);

            // Group by month
            var result = new List<MonthlyStatsDto>();

            for (int i = 0; i < request.Months; i++)
            {
                var monthDate = startDate.AddMonths(i);
                var monthStart = DateTime.SpecifyKind(new DateTime(monthDate.Year, monthDate.Month, 1), DateTimeKind.Utc);
                var monthEnd = monthStart.AddMonths(1);

                var monthTransactions = transactions
                    .Where(t => t.TransactionDate >= monthStart && t.TransactionDate < monthEnd)
                    .ToList();

                var stats = new MonthlyStatsDto
                {
                    Month = monthStart.ToString("yyyy-MM"),
                    MonthLabel = monthStart.ToString("MM/yy"),  // Format: 01/26, 02/26...
                    // Return absolute values for display
                    Expense = Math.Abs(monthTransactions.Where(t => t.Amount < 0).Sum(t => t.Amount)),
                    Income = monthTransactions.Where(t => t.Amount > 0).Sum(t => t.Amount),
                    DebtIncrease = CalculateDebtIncrease(monthTransactions),
                    DebtDecrease = CalculateDebtDecrease(monthTransactions)
                };

                result.Add(stats);
            }

            return result;
        }

        private decimal CalculateDebtIncrease(List<Domain.Entities.Transaction> transactions)
        {
            // Debt increase = when partner balance goes up (partner owes me more, or I owe partner more)
            // Based on PartnerBalanceAfter - PartnerBalanceBefore
            decimal total = 0;

            foreach (var t in transactions)
            {
                if (t.PartnerBalanceBefore.HasValue && t.PartnerBalanceAfter.HasValue)
                {
                    var delta = t.PartnerBalanceAfter.Value - t.PartnerBalanceBefore.Value;
                    // Positive delta = partner owes more (debt increase from partner's perspective)
                    // Negative delta = I owe more (debt increase from my perspective)
                    // We want to track "debt activity" regardless of direction
                    if (delta > 0)
                    {
                        total += delta;  // Partner owes me more
                    }
                }
            }

            return total;
        }

        private decimal CalculateDebtDecrease(List<Domain.Entities.Transaction> transactions)
        {
            // Debt decrease = when debt is being repaid
            decimal total = 0;

            foreach (var t in transactions)
            {
                if (t.PartnerBalanceBefore.HasValue && t.PartnerBalanceAfter.HasValue)
                {
                    var delta = t.PartnerBalanceAfter.Value - t.PartnerBalanceBefore.Value;
                    // Negative delta when partner owed me = debt repaid
                    // Positive delta when I owed partner = debt repaid (balance goes toward 0)
                    if (delta < 0)
                    {
                        total += Math.Abs(delta);  // Debt reduced
                    }
                }
            }

            return total;
        }
    }
}
