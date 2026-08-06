using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Application.Features.Auth.Refresh;

public class RefreshCommandHandler : IRequestHandler<RefreshCommand, RefreshResponse>
{
    private readonly IApplicationDbContext _dbContext;
    private readonly ITokenGenerator _tokenGenerator;
    private readonly IConfiguration _configuration;

    public RefreshCommandHandler(
        IApplicationDbContext dbContext,
        ITokenGenerator tokenGenerator,
        IConfiguration configuration)
    {
        _dbContext = dbContext;
        _tokenGenerator = tokenGenerator;
        _configuration = configuration;
    }

    public async Task<RefreshResponse> Handle(RefreshCommand request, CancellationToken cancellationToken)
    {
        var tokenHash = _tokenGenerator.HashRefreshToken(request.RefreshToken);
        var now = DateTime.UtcNow;

        await using var transaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);

        var storedToken = await _dbContext.RefreshTokens
            .Include(token => token.User)
            .FirstOrDefaultAsync(token => token.TokenHash == tokenHash, cancellationToken);

        if (storedToken is null)
        {
            return Unauthorized();
        }

        if (storedToken.RevokedAt is not null)
        {
            await RevokeFamilyAsync(storedToken.FamilyId, now, cancellationToken);
            await transaction.CommitAsync(cancellationToken);
            return Unauthorized();
        }

        if (storedToken.ExpiresAt <= now)
        {
            return Unauthorized();
        }

        var replacementRefreshToken = _tokenGenerator.GenerateRefreshToken();
        var replacementRefreshTokenHash = _tokenGenerator.HashRefreshToken(replacementRefreshToken);
        var refreshTokenExpirationDays = GetConfiguredInt("Jwt:RefreshTokenExpirationDays", 7);

        var revokedRows = await _dbContext.RefreshTokens
            .Where(token => token.TokenHash == tokenHash && token.RevokedAt == null && token.ExpiresAt > now)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(token => token.RevokedAt, now)
                .SetProperty(token => token.ReplacedByTokenHash, replacementRefreshTokenHash), cancellationToken);

        if (revokedRows != 1)
        {
            var replayedToken = await _dbContext.RefreshTokens
                .AsNoTracking()
                .FirstOrDefaultAsync(token => token.TokenHash == tokenHash, cancellationToken);

            if (replayedToken is not null && replayedToken.RevokedAt is not null)
            {
                await RevokeFamilyAsync(replayedToken.FamilyId, now, cancellationToken);
                await transaction.CommitAsync(cancellationToken);
            }

            return Unauthorized();
        }

        _dbContext.RefreshTokens.Add(new RefreshToken
        {
            UserId = storedToken.UserId,
            TokenHash = replacementRefreshTokenHash,
            FamilyId = storedToken.FamilyId,
            ExpiresAt = now.AddDays(refreshTokenExpirationDays),
            CreatedAt = now
        });

        await _dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);

        return new RefreshResponse
        {
            Token = _tokenGenerator.GenerateAccessToken(storedToken.User),
            Expiration = now.AddMinutes(GetConfiguredInt("Jwt:AccessTokenExpirationMinutes", GetConfiguredInt("Jwt:ExpirationMinutes", 60))),
            RefreshToken = replacementRefreshToken,
            IsAuthorized = true
        };
    }

    private async Task RevokeFamilyAsync(Guid familyId, DateTime now, CancellationToken cancellationToken)
    {
        await _dbContext.RefreshTokens
            .Where(token => token.FamilyId == familyId && token.RevokedAt == null)
            .ExecuteUpdateAsync(setters => setters.SetProperty(token => token.RevokedAt, now), cancellationToken);
    }

    private RefreshResponse Unauthorized() => new();

    private int GetConfiguredInt(string key, int fallback) =>
        int.TryParse(_configuration[key], out var value) ? value : fallback;
}
