using MediatR;

namespace Application.Features.Users.UpdateProfile
{
    public class UpdateProfileCommand : IRequest
    {
        public Guid UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public string? Email { get; set; }
    }
}
