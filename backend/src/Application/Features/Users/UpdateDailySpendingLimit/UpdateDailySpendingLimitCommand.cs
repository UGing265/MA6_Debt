using MediatR;

namespace Application.Features.Users.UpdateDailySpendingLimit
{
    public class UpdateDailySpendingLimitCommand : IRequest
    {
        public Guid UserId { get; set; }
        public bool Enabled { get; set; }
        public decimal? Amount { get; set; }
    }
}
