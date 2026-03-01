using MediatR;

namespace Application.Features.Users.UpdateDefaultPartner
{
    public class UpdateDefaultPartnerCommand : IRequest
    {
        public Guid UserId { get; set; }
        public Guid? PartnerId { get; set; }
    }
}
