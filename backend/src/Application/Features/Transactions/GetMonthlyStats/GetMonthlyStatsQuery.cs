using MediatR;

namespace Application.Features.Transactions.GetMonthlyStats
{
    public class GetMonthlyStatsQuery : IRequest<List<MonthlyStatsDto>>
    {
        public Guid UserId { get; set; }
        public int Months { get; set; } = 6;
    }

    public class MonthlyStatsDto
    {
        public string Month { get; set; } = string.Empty;  // Format: "2026-01"
        public string MonthLabel { get; set; } = string.Empty;  // Format: "Jan"
        public decimal Expense { get; set; }  // Total expenses (negative amounts)
        public decimal Income { get; set; }  // Total income (positive amounts)
        public decimal DebtIncrease { get; set; }  // Debt added (I owe more)
        public decimal DebtDecrease { get; set; }  // Debt repaid (debt reduced)
    }
}
