using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Users.UpdateDefaultPartner
{
    public class UpdateDefaultPartnerCommandHandler : IRequestHandler<UpdateDefaultPartnerCommand>
    {
        private readonly IApplicationDbContext _context;

        public UpdateDefaultPartnerCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task Handle(UpdateDefaultPartnerCommand request, CancellationToken cancellationToken)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == request.UserId, cancellationToken);

            if (user == null)
            {
                throw new NotFoundException("User", request.UserId);
            }

            // If setting a partner, verify it exists and belongs to user
            if (request.PartnerId.HasValue)
            {
                var partnerExists = await _context.DebtPartners
                    .AnyAsync(p => p.Id == request.PartnerId.Value && p.UserId == request.UserId, cancellationToken);

                if (!partnerExists)
                {
                    throw new NotFoundException("DebtPartner", request.PartnerId.Value);
                }
            }

            user.DefaultPartnerId = request.PartnerId;
            await _context.SaveChangesAsync(cancellationToken);
        }
    }
}
