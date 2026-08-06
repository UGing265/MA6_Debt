using MediatR;

namespace Application.Features.Auth.Logout;

public class LogoutCommand : IRequest
{
    public string? RefreshToken { get; set; }
}
