using API.Auth;
using API.Middleware;
using Application.Features.Auth.Login;
using Application.Features.Auth.Logout;
using Application.Features.Auth.Refresh;
using Application.Features.Auth.Register;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IConfiguration _configuration;

    public AuthController(IMediator mediator, IConfiguration configuration)

    {
        _mediator = mediator;
        _configuration = configuration;
    }

    [HttpPost("login")]
    [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var command = new LoginCommand { Username = request.Username, Password = request.Password };
        var result = await _mediator.Send(command);

        Response.Cookies.Append(
            AuthCookieOptions.GetAccessTokenName(_configuration),
            result.Token,
            AuthCookieOptions.CreateAccessTokenOptions(_configuration));

        Response.Cookies.Append(
            AuthCookieOptions.GetRefreshTokenName(_configuration),
            result.RefreshToken,
            AuthCookieOptions.CreateRefreshTokenOptions(_configuration));

        return Ok(result);
    }

    [HttpPost("refresh")]
    [ProducesResponseType(typeof(RefreshResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<RefreshResponse>> Refresh()
    {
        var refreshTokenName = AuthCookieOptions.GetRefreshTokenName(_configuration);

        if (!Request.Cookies.TryGetValue(refreshTokenName, out var refreshToken) || string.IsNullOrWhiteSpace(refreshToken))
        {
            ClearAuthCookies();
            return Unauthorized();
        }

        var result = await _mediator.Send(new RefreshCommand { RefreshToken = refreshToken });

        if (!result.IsAuthorized)
        {
            ClearAuthCookies();
            return Unauthorized();
        }

        Response.Cookies.Append(
            AuthCookieOptions.GetAccessTokenName(_configuration),
            result.Token,
            AuthCookieOptions.CreateAccessTokenOptions(_configuration));

        Response.Cookies.Append(
            refreshTokenName,
            result.RefreshToken,
            AuthCookieOptions.CreateRefreshTokenOptions(_configuration));

        return Ok(result);
    }

    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Logout()
    {
        var refreshTokenName = AuthCookieOptions.GetRefreshTokenName(_configuration);
        Request.Cookies.TryGetValue(refreshTokenName, out var refreshToken);

        await _mediator.Send(new LogoutCommand { RefreshToken = refreshToken });
        ClearAuthCookies();

        return NoContent();
    }
	
    [HttpPost("register")]
    [ProducesResponseType(typeof(RegisterResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<RegisterResponse>> Register([FromBody] RegisterRequest request)
    {
        var command = new RegisterCommand 
        { 
            Username = request.Username, 
            Password = request.Password,
            Email = request.Email,
            Name = request.Name
        };
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    private void ClearAuthCookies()
    {
        Response.Cookies.Append(
            AuthCookieOptions.GetAccessTokenName(_configuration),
            string.Empty,
            CreateExpiredOptions(AuthCookieOptions.CreateAccessTokenOptions(_configuration)));

        Response.Cookies.Append(
            AuthCookieOptions.GetRefreshTokenName(_configuration),
            string.Empty,
            CreateExpiredOptions(AuthCookieOptions.CreateRefreshTokenOptions(_configuration)));
    }

    private static CookieOptions CreateExpiredOptions(CookieOptions source)
    {
        source.Expires = DateTimeOffset.UnixEpoch;
        source.MaxAge = TimeSpan.Zero;
        return source;
    }
}
