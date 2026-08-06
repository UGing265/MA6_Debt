using MediatR;

namespace Application.Features.Auth.Refresh;

public class RefreshCommand : IRequest<RefreshResponse>
{
    public string RefreshToken { get; set; } = string.Empty;
}
