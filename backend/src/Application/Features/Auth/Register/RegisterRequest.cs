using System.ComponentModel.DataAnnotations;

namespace Application.Features.Auth.Register;

public class RegisterRequest
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    [EmailAddress]
    public string? Email { get; set; }

    [Required]
    [MinLength(3)]
    public string Name { get; set; } = string.Empty;
}
