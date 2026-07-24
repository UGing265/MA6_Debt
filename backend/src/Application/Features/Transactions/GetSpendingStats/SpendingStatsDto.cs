namespace Application.Features.Transactions.GetSpendingStats
{
    public class SpendingStatsDto
    {
        public string Label { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }
}
