using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Users.GetUserPreferences
{
    public class GetUserPreferencesQueryHandler : IRequestHandler<GetUserPreferencesQuery, UserPreferencesDto>
    {
        private readonly IApplicationDbContext _context;

        public GetUserPreferencesQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<UserPreferencesDto> Handle(GetUserPreferencesQuery request, CancellationToken cancellationToken)
        {
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

            if (user == null)
            {
                return new UserPreferencesDto();
            }

            return new UserPreferencesDto
            {
                DefaultWalletId = user.DefaultWalletId,
                DefaultPartnerId = user.DefaultPartnerId
            };
        }
    }
}
