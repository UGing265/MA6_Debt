using API.Middleware;
using Application.Features.Users.GetProfile;
using Application.Features.Users.GetUserPreferences;
using Application.Features.Users.UpdateDefaultWallet;
using Application.Features.Users.UpdateDefaultPartner;
using Application.Features.Users.UpdateDailySpendingLimit;
using Application.Features.Users.UpdateProfile;
using Application.Features.Users.ChangePassword;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;

    public UsersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("profile")]
    [ProducesResponseType(typeof(ProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetProfile()
    {
        var result = await _mediator.Send(new GetProfileQuery
        {
            UserId = GetCurrentUserId()
        });
        return Ok(result);
    }

    [HttpPut("profile")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        await _mediator.Send(new UpdateProfileCommand
        {
            UserId = GetCurrentUserId(),
            Username = request.Username,
            Email = request.Email
        });
        return NoContent();
    }

    [HttpPut("password")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        await _mediator.Send(new ChangePasswordCommand
        {
            UserId = GetCurrentUserId(),
            CurrentPassword = request.CurrentPassword,
            NewPassword = request.NewPassword
        });
        return NoContent();
    }

    [HttpGet("preferences")]
    [ProducesResponseType(typeof(UserPreferencesDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetPreferences()
    {
        var result = await _mediator.Send(new GetUserPreferencesQuery
        {
            UserId = GetCurrentUserId()
        });
        return Ok(result);
    }

    [HttpPut("default-wallet")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateDefaultWallet([FromBody] UpdateDefaultWalletRequest request)
    {
        await _mediator.Send(new UpdateDefaultWalletCommand
        {
            UserId = GetCurrentUserId(),
            WalletId = request.WalletId
        });
        return NoContent();
    }

    [HttpPut("default-partner")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateDefaultPartner([FromBody] UpdateDefaultPartnerRequest request)
    {
        await _mediator.Send(new UpdateDefaultPartnerCommand
        {
            UserId = GetCurrentUserId(),
            PartnerId = request.PartnerId
        });
        return NoContent();
    }

    [HttpPut("daily-spending-limit")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateDailySpendingLimit([FromBody] UpdateDailySpendingLimitRequest request)
    {
        await _mediator.Send(new UpdateDailySpendingLimitCommand
        {
            UserId = GetCurrentUserId(),
            Enabled = request.Enabled,
            Amount = request.Amount
        });
        return NoContent();
    }

    private Guid GetCurrentUserId()
    {
        var value = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (!Guid.TryParse(value, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user token.");
        }
        return userId;
    }
}

public record UpdateDefaultWalletRequest(Guid? WalletId);
public record UpdateDefaultPartnerRequest(Guid? PartnerId);
public record UpdateDailySpendingLimitRequest(bool Enabled, decimal? Amount);
public record UpdateProfileRequest(string Username, string? Email);
public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
