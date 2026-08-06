using System.Text.Json.Serialization;

namespace Application.Features.Auth.Refresh;

public class RefreshResponse
{
    public string Token { get; set; } = string.Empty;
    public DateTime Expiration { get; set; }

    [JsonIgnore]
    public string RefreshToken { get; set; } = string.Empty;

    [JsonIgnore]
    public bool IsAuthorized { get; set; }
}
