using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.DebtPartners.GetDebtPartners
{
    public class GetDebtPartnersQueryHandler : IRequestHandler<GetDebtPartnersQuery, IReadOnlyList<DebtPartnerDto>>
    {
        private readonly IApplicationDbContext _context;

        public GetDebtPartnersQueryHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IReadOnlyList<DebtPartnerDto>> Handle(GetDebtPartnersQuery request, CancellationToken cancellationToken)
        {
            var debtPartners = await _context.DebtPartners
                .AsNoTracking()
                .Where(dp => dp.UserId == request.UserId && !dp.IsDeleted)
                .Select(dp => new DebtPartnerDto
                {
                    Id = dp.Id,
                    Name = dp.Name,
                    Balance = dp.Balance
                })
                .OrderBy(dp => dp.Name)
                .ToListAsync(cancellationToken);

            return debtPartners;
        }
    }
}
