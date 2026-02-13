using MediatR;
using System.ComponentModel.DataAnnotations;

namespace Application.Features.Auth.Login;

public class LoginCommand : IRequest<LoginResponse>
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
