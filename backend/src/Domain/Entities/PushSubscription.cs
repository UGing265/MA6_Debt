using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class PushSubscription
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        public Guid UserId { get; set; }

        [Required]
        public string Endpoint { get; set; } = string.Empty;

        [Required]
        public string P256dh { get; set; } = string.Empty;

        [Required]
        public string Auth { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime LastSeenAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;
    }
}
