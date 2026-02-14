using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;

namespace Application.Features.DebtPartners.CreateDebtPartner
{
    public class CreateDebtPartnerCommandHandler : IRequestHandler<CreateDebtPartnerCommand, DebtPartnerDto>
    {
        private readonly IApplicationDbContext _context;

        public CreateDebtPartnerCommandHandler(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DebtPartnerDto> Handle(CreateDebtPartnerCommand request, CancellationToken cancellationToken)
        {
            var debtPartner = new DebtPartner
            {
                UserId = request.UserId,
                Name = request.Name,
                InitialBalance = request.InitialBalance,
                IsDeleted = false,
                CreatedAt = DateTime.UtcNow
            };

            _context.DebtPartners.Add(debtPartner);
            await _context.SaveChangesAsync(cancellationToken);

            return new DebtPartnerDto
            {
                Id = debtPartner.Id,
                Name = debtPartner.Name,
                InitialBalance = debtPartner.InitialBalance
            };
        }
    }
}
