using MediatR;

namespace Application.Features.Auth.Register;

public class RegisterCommand : IRequest<RegisterResponse>
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? Name { get; set; }
}
