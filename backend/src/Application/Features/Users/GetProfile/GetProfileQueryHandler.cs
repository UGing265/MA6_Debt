using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Users.GetProfile
{
    public class GetProfileQueryHandler : IRequestHandler<GetProfileQuery, ProfileDto>
    {
        private readonly IApplicationDbContext _context;

        public GetProfileQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ProfileDto> Handle(GetProfileQuery request, CancellationToken cancellationToken)
        {
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

            if (user == null)
            {
                throw new NotFoundException("User", request.UserId);
            }

            return new ProfileDto
            {
                Username = user.Username,
                Email = user.Email,
                Name = user.Name,
                CreatedAt = user.CreatedAt
            };
        }
    }
}
