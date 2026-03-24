using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.DebtPartners.UpdateDebtPartner
{
    public class UpdateDebtPartnerCommandHandler : IRequestHandler<UpdateDebtPartnerCommand, DebtPartnerDto>
    {
        private readonly IApplicationDbContext _context;

        public UpdateDebtPartnerCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DebtPartnerDto> Handle(UpdateDebtPartnerCommand request, CancellationToken cancellationToken)
        {
            var debtPartner = await _context.DebtPartners
                .FirstOrDefaultAsync(dp => dp.Id == request.Id && dp.UserId == request.UserId && !dp.IsDeleted, cancellationToken);

            if (debtPartner is null)
            {
                throw new NotFoundException("DebtPartner", request.Id);
            }

            debtPartner.Name = request.Name;
            debtPartner.Balance = request.Balance;

            await _context.SaveChangesAsync(cancellationToken);

            return new DebtPartnerDto
            {
                Id = debtPartner.Id,
                Name = debtPartner.Name,
                Balance = debtPartner.Balance
            };
        }
    }
}
