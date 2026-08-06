using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Auth.Logout;

public class LogoutCommandHandler : IRequestHandler<LogoutCommand>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly ITokenGenerator _tokenGenerator;

    public LogoutCommandHandler(IApplicationDbContext dbContext, ITokenGenerator tokenGenerator)
    {
        _dbContext = dbContext;
        _tokenGenerator = tokenGenerator;
    }

    public async Task Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            return;
        }

        var tokenHash = _tokenGenerator.HashRefreshToken(request.RefreshToken);
        var now = DateTime.UtcNow;

        var storedToken = await _dbContext.RefreshTokens
            .FirstOrDefaultAsync(token => token.TokenHash == tokenHash && token.RevokedAt == null && token.ExpiresAt > now, cancellationToken);

        if (storedToken is not null)
        {
            storedToken.RevokedAt = now;
            await _dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
