using API.Middleware;
using API.Contracts.Transfers;
using Application.Features.Transfers;
using Application.Features.Transfers.CreateTransfer;
using Application.Features.Transfers.GetTransferById;
using Application.Features.Transfers.GetTransfers;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace API.Controllers;

/// <summary>
/// Controller for internal wallet transfer operations.
/// </summary>
[ApiController]
[Authorize]
[Route("api/[controller]")]
public class TransfersController : ControllerBase
{
    private readonly IMediator _mediator;

    public TransfersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Create an internal transfer between two wallets owned by the current user.
    /// </summary>
    /// <param name="request">Transfer input (user identity is taken from the JWT subject claim).</param>
    /// <remarks>
    /// Example request:
    /// {
    ///   "fromWalletId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    ///   "toWalletId": "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    ///   "amount": 12.34,
    ///   "sourceTransactionId": null,
    ///   "destinationTransactionId": null
    /// }
    ///
    /// Example validation error (400):
    /// {
    ///   "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
    ///   "title": "Validation Error",
    ///   "status": 400,
    ///   "errors": { "Amount": [ "Amount must be greater than 0." ] }
    /// }
    /// </remarks>
    [HttpPost]
    [ProducesResponseType(typeof(TransferDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<TransferDto>> Create([FromBody] CreateTransferRequest request)
    {
        var command = new CreateTransferCommand
        {
            UserId = GetCurrentUserId(),
            FromWalletId = request.FromWalletId,
            ToWalletId = request.ToWalletId,
            Amount = request.Amount,
            SourceTransactionId = request.SourceTransactionId,
            DestinationTransactionId = request.DestinationTransactionId
        };

        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    /// <summary>
    /// Get all transfers for the current user.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<TransferDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IReadOnlyList<TransferDto>>> GetAll()
    {
        var result = await _mediator.Send(new GetTransfersQuery
        {
            UserId = GetCurrentUserId()
        });

        return Ok(result);
    }

    /// <summary>
    /// Get a specific transfer by ID.
    /// </summary>
    /// <param name="id">Transfer identifier.</param>
    /// <remarks>
    /// Example not found error (404):
    /// {
    ///   "type": "https://tools.ietf.org/html/rfc7231#section-6.5.4",
    ///   "title": "Not Found",
    ///   "status": 404,
    ///   "errors": { "NotFound": [ "Transfer not found." ] }
    /// }
    /// </remarks>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(TransferDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<TransferDto>> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetTransferByIdQuery
        {
            Id = id,
            UserId = GetCurrentUserId()
        });

        return Ok(result);
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
