using MediatR;

namespace Application.Features.Users.GetProfile
{
    public class GetProfileQuery : IRequest<ProfileDto>
    {
        public Guid UserId { get; set; }
    }

    public class ProfileDto
    {
        public string Username { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Name { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
