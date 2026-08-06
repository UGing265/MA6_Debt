using System.Text.Json.Serialization;

namespace Application.Features.Auth.Login;

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public DateTime Expiration { get; set; }

    [JsonIgnore]
    public string RefreshToken { get; set; } = string.Empty;
}
