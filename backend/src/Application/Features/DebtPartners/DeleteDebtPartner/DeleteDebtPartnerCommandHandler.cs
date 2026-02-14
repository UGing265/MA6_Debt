using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.DebtPartners.DeleteDebtPartner
{
    public class DeleteDebtPartnerCommandHandler : IRequestHandler<DeleteDebtPartnerCommand, Unit>
    {
        private readonly IApplicationDbContext _context;

        public DeleteDebtPartnerCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Unit> Handle(DeleteDebtPartnerCommand request, CancellationToken cancellationToken)
        {
            var debtPartner = await _context.DebtPartners
                .FirstOrDefaultAsync(dp => dp.Id == request.Id && dp.UserId == request.UserId && !dp.IsDeleted, cancellationToken);

            if (debtPartner is null)
            {
                throw new NotFoundException("DebtPartner", request.Id);
            }

            debtPartner.IsDeleted = true;
            await _context.SaveChangesAsync(cancellationToken);

            return Unit.Value;
        }
    }
}
