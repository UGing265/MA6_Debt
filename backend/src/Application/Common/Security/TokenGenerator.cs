using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;


namespace Application.Common.Security;

/// <summary>
/// JWT token generator implementation using System.IdentityModel.Tokens.Jwt.
/// </summary>
public class TokenGenerator : ITokenGenerator
{
    private const int RefreshTokenByteLength = 64;

    private readonly IConfiguration _configuration;

    public TokenGenerator(IConfiguration configuration)
    {
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
    }

    public string GenerateAccessToken(User user)
    {
        if (user == null)
        {
            throw new ArgumentNullException(nameof(user));
        }

        var secret = _configuration["Jwt:Secret"];
        var issuer = _configuration["Jwt:Issuer"];
        var audience = _configuration["Jwt:Audience"];
        var expirationValue = _configuration["Jwt:AccessTokenExpirationMinutes"]
            ?? _configuration["Jwt:ExpirationMinutes"];
        var expirationMinutes = int.TryParse(expirationValue, out var minutes)
            ? minutes
            : 60;

        if (string.IsNullOrWhiteSpace(secret))
        {
            throw new InvalidOperationException("JWT Secret is not configured in appsettings.json");
        }

        if (string.IsNullOrWhiteSpace(issuer))
        {
            throw new InvalidOperationException("JWT Issuer is not configured in appsettings.json");
        }

        if (string.IsNullOrWhiteSpace(audience))
        {
            throw new InvalidOperationException("JWT Audience is not configured in appsettings.json");
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

         var claims = new List<Claim>
         {
             new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
             new Claim(JwtRegisteredClaimNames.Name, user.Username),
         };

         if (!string.IsNullOrWhiteSpace(user.Email))
         {
             claims.Add(new Claim(JwtRegisteredClaimNames.Email, user.Email));
         }

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expirationMinutes),
            signingCredentials: credentials
        );

        var tokenHandler = new JwtSecurityTokenHandler();
        return tokenHandler.WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomBytes = RandomNumberGenerator.GetBytes(RefreshTokenByteLength);
        return Base64UrlEncoder.Encode(randomBytes);
    }

    public string HashRefreshToken(string token)
    {
        if (string.IsNullOrWhiteSpace(token))
        {
            throw new ArgumentException("Refresh token cannot be empty.", nameof(token));
        }

        var tokenBytes = Encoding.UTF8.GetBytes(token);
        var hashBytes = SHA256.HashData(tokenBytes);
        return Base64UrlEncoder.Encode(hashBytes);
    }

    public string GenerateToken(User user)
    {
        return GenerateAccessToken(user);
    }
}
