using MediatR;
using System.Text.Json.Serialization;

namespace Application.Features.Wallets.UpdateWallet
{
    public class UpdateWalletCommand : IRequest<WalletDto>
    {
        [JsonIgnore]
        public Guid UserId { get; set; }
        public Guid Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public Guid? ParentWalletId { get; set; }
    }
}
