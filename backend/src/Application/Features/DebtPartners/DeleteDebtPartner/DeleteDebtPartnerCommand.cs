using MediatR;

namespace Application.Features.DebtPartners.DeleteDebtPartner
{
    public class DeleteDebtPartnerCommand : IRequest<Unit>
    {
        public Guid UserId { get; set; }
        public Guid Id { get; set; }
    }
}
