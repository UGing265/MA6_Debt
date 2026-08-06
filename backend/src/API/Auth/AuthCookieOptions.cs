using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace API.Auth;

public static class AuthCookieOptions
{
    public const string AccessTokenCookieName = "access_token";
    public const string RefreshTokenCookieName = "refresh_token";

    public static string GetAccessTokenName(IConfiguration configuration) =>
        GetConfiguredString(configuration, "Jwt:Cookies:AccessTokenName", AccessTokenCookieName);

    public static string GetRefreshTokenName(IConfiguration configuration) =>
        GetConfiguredString(configuration, "Jwt:Cookies:RefreshTokenName", RefreshTokenCookieName);

    public static CookieOptions CreateAccessTokenOptions(IConfiguration configuration) =>
        CreateCookieOptions(DateTimeOffset.UtcNow.AddMinutes(GetConfiguredInt(configuration, "Jwt:AccessTokenExpirationMinutes", 15)));

    public static CookieOptions CreateRefreshTokenOptions(IConfiguration configuration) =>
        CreateCookieOptions(DateTimeOffset.UtcNow.AddDays(GetConfiguredInt(configuration, "Jwt:RefreshTokenExpirationDays", 7)));

    private static CookieOptions CreateCookieOptions(DateTimeOffset expires) => new()
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.None,
        Path = "/",
        Expires = expires
    };

    private static int GetConfiguredInt(IConfiguration configuration, string key, int fallback) =>
        int.TryParse(configuration[key], out var value) ? value : fallback;

    private static string GetConfiguredString(IConfiguration configuration, string key, string fallback) =>
        string.IsNullOrWhiteSpace(configuration[key]) ? fallback : configuration[key]!;
}
