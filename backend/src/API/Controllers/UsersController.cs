using API.Middleware;
using Application.Features.Users.GetUserPreferences;
using Application.Features.Users.UpdateDefaultWallet;
using Application.Features.Users.UpdateDefaultPartner;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }
        return Guid.Parse(userIdClaim);
    }
}

public record UpdateDefaultWalletRequest(Guid? WalletId);
public record UpdateDefaultPartnerRequest(Guid? PartnerId);
