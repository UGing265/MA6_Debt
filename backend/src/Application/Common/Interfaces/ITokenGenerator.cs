using Domain.Entities;

namespace Application.Common.Interfaces;

/// <summary>
/// Interface for JWT token generation.
/// </summary>
public interface ITokenGenerator
{
    /// <summary>
    /// Generates a JWT token for the specified user.
    /// </summary>
    /// <param name="user">The user for whom to generate the token</param>
    /// <returns>A JWT token string</returns>
    string GenerateToken(User user);
}
