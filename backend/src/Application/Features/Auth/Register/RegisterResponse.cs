namespace Application.Features.Auth.Register;

public class RegisterResponse
{
    public string SuccessMessage { get; set; } = string.Empty;
    public Guid UserId { get; set; }
}
