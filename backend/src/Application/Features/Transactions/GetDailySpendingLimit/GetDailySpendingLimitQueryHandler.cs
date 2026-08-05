using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Transactions.GetDailySpendingLimit
{
    public class GetDailySpendingLimitQueryHandler : IRequestHandler<GetDailySpendingLimitQuery, DailySpendingLimitDto>
    {
        private readonly IApplicationDbContext _context;

        public GetDailySpendingLimitQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DailySpendingLimitDto> Handle(GetDailySpendingLimitQuery request, CancellationToken cancellationToken)
        {
            var nowLocal = DateTime.UtcNow.AddHours(7);
            var startLocal = new DateTime(nowLocal.Year, nowLocal.Month, nowLocal.Day);
            var startUtc = DateTime.SpecifyKind(startLocal.AddHours(-7), DateTimeKind.Utc);
            var endUtc = startUtc.AddDays(1);

            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

            var spentAmount = await _context.Transactions
                .AsNoTracking()
                .Include(t => t.Wallet)
                .Where(t => t.Wallet.UserId == request.UserId)
                .Where(t => t.TransactionDate >= startUtc && t.TransactionDate < endUtc)
                .Where(t => t.Amount < 0)
                .Where(t => t.Note == null || !t.Note.StartsWith("Transfer to "))
                .SumAsync(t => Math.Abs(t.Amount), cancellationToken);

            var enabled = user?.DailySpendingLimitEnabled ?? false;
            var limitAmount = enabled ? user?.DailySpendingLimitAmount : null;
            var remaining = limitAmount.HasValue ? limitAmount.Value - spentAmount : (decimal?)null;

            return new DailySpendingLimitDto
            {
                Date = startLocal.ToString("yyyy-MM-dd"),
                Enabled = enabled,
                LimitAmount = limitAmount,
                SpentAmount = spentAmount,
                RemainingAmount = remaining.HasValue && remaining.Value >= 0 ? remaining.Value : null,
                OverAmount = remaining.HasValue && remaining.Value < 0 ? Math.Abs(remaining.Value) : null
            };
        }
    }
}
