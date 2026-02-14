using Application.Common.Exceptions;
using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.DebtPartners.GetDebtPartnerById
{
    public class GetDebtPartnerByIdQueryHandler : IRequestHandler<GetDebtPartnerByIdQuery, DebtPartnerDto>
    {
        private readonly IApplicationDbContext _context;

        public GetDebtPartnerByIdQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DebtPartnerDto> Handle(GetDebtPartnerByIdQuery request, CancellationToken cancellationToken)
        {
            var debtPartner = await _context.DebtPartners
                .AsNoTracking()
                .Where(dp => dp.Id == request.Id && dp.UserId == request.UserId && !dp.IsDeleted)
                .Select(dp => new DebtPartnerDto
                {
                    Id = dp.Id,
                    Name = dp.Name,
                    Balance = dp.Balance
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (debtPartner is null)
            {
                throw new NotFoundException("DebtPartner", request.Id);
            }

            return debtPartner;
        }
    }
}
