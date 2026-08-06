using MediatR;

namespace Application.Features.Users.GetUserPreferences
{
    public class GetUserPreferencesQuery : IRequest<UserPreferencesDto>
    {
        public Guid UserId { get; set; }
    }

    public class UserPreferencesDto
    {
        public Guid? DefaultWalletId { get; set; }
        public Guid? DefaultPartnerId { get; set; }
        public bool DailySpendingLimitEnabled { get; set; }
        public decimal? DailySpendingLimitAmount { get; set; }
    }
}
