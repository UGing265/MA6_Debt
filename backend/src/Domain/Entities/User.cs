using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public string? Name { get; set; }

        public string? Email { get; set; }

        public Guid? DefaultWalletId { get; set; }

        public Guid? DefaultPartnerId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Properties
        public ICollection<Wallet> Wallets { get; set; } = new List<Wallet>();
        public ICollection<DebtPartner> DebtPartners { get; set; } = new List<DebtPartner>();
    }
}
