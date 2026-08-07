using Application.Features.Push.GetPublicKey;
using Application.Features.Push.SendTest;
using Application.Features.Push.Subscribe;
using Application.Features.Push.Unsubscribe;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class PushController : ControllerBase
{
    private readonly IMediator _mediator;

    public PushController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("public-key")]
    [ProducesResponseType(typeof(PushPublicKeyResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetPublicKey()
    {
        var publicKey = await _mediator.Send(new GetPushPublicKeyQuery());
        return Ok(new PushPublicKeyResponse(publicKey));
    }

    [HttpPost("subscribe")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Subscribe([FromBody] PushSubscriptionRequest request)
    {
        await _mediator.Send(new SubscribePushCommand
        {
            UserId = GetCurrentUserId(),
            Endpoint = request.Endpoint,
            P256dh = request.Keys.P256dh,
            Auth = request.Keys.Auth
        });

        return NoContent();
    }

    [HttpDelete("subscribe")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Unsubscribe([FromBody] PushUnsubscribeRequest request)
    {
        await _mediator.Send(new UnsubscribePushCommand
        {
            UserId = GetCurrentUserId(),
            Endpoint = request.Endpoint
        });

        return NoContent();
    }

    [HttpPost("test")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> SendTest()
    {
        await _mediator.Send(new SendTestPushCommand
        {
            UserId = GetCurrentUserId()
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

public record PushPublicKeyResponse(string PublicKey);

public record PushSubscriptionRequest(string Endpoint, PushSubscriptionKeysRequest Keys);

public record PushSubscriptionKeysRequest(string P256dh, string Auth);

public record PushUnsubscribeRequest(string Endpoint);
