using MediatR;

namespace Application.Features.Transactions.GetDailySpendingLimit
{
    public class GetDailySpendingLimitQuery : IRequest<DailySpendingLimitDto>
    {
        public Guid UserId { get; set; }
    }

    public class DailySpendingLimitDto
    {
        public string Date { get; set; } = string.Empty;
        public bool Enabled { get; set; }
        public decimal? LimitAmount { get; set; }
        public decimal SpentAmount { get; set; }
        public decimal? RemainingAmount { get; set; }
        public decimal? OverAmount { get; set; }
    }
}
