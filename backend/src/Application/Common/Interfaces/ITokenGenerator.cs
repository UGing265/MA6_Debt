using Domain.Entities;

namespace Application.Common.Interfaces;

/// <summary>
/// Interface for token generation and refresh-token hashing.
/// </summary>
public interface ITokenGenerator
{
    /// <summary>
    /// Generates an access JWT for the specified user.
    /// </summary>
    /// <param name="user">The user for whom to generate the token</param>
    /// <returns>An access JWT string</returns>
    string GenerateAccessToken(User user);

    /// <summary>
    /// Generates a cryptographically secure refresh token.
    /// </summary>
    /// <returns>A refresh token string</returns>
    string GenerateRefreshToken();

    /// <summary>
    /// Hashes a refresh token for deterministic lookup.
    /// </summary>
    /// <param name="token">The raw refresh token</param>
    /// <returns>A deterministic refresh token hash</returns>
    string HashRefreshToken(string token);

    /// <summary>
    /// Generates a JWT token for the specified user.
    /// </summary>
    /// <param name="user">The user for whom to generate the token</param>
    /// <returns>A JWT token string</returns>
    string GenerateToken(User user);
}
