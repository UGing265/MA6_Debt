using API.Middleware;
using Application.Features.Transactions;
using Application.Features.Transactions.CashAdjustment;
using Application.Features.Transactions.GetTransactionById;
using Application.Features.Transactions.GetTransactions;
using Application.Features.Transactions.QuickDeduct;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace API.Controllers
{
    /// <summary>
    /// Controller for transaction operations implementing US-03 Quick Deduct and US-04 Debt Notification.
    /// </summary>
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public TransactionsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        /// <summary>
        /// US-03: Create a quick deduct transaction with hybrid debt-tagging.
        /// Returns transaction details and US-04 debt notification.
        /// </summary>
        [HttpPost("quick-deduct")]
        [ProducesResponseType(typeof(QuickDeductResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<QuickDeductResponse>> QuickDeduct([FromBody] QuickDeductCommand command)
        {
            command.UserId = GetCurrentUserId();
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result.Transaction.Id }, result);
        }

        /// <summary>
        /// Create a cash adjustment transaction (add/subtract wallet balance).
        /// Personal-only flow: no partner, no debt, reason required.
        /// </summary>
        [HttpPost("adjustment")]
        [ProducesResponseType(typeof(TransactionDto), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<TransactionDto>> CashAdjustment([FromBody] CreateCashAdjustmentCommand command)
        {
            command.UserId = GetCurrentUserId();
            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        /// <summary>
        /// Get all transactions for the current user, optionally filtered by wallet.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(IReadOnlyList<TransactionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<IReadOnlyList<TransactionDto>>> GetAll([FromQuery] Guid? walletId)
        {
            var result = await _mediator.Send(new GetTransactionsQuery
            {
                UserId = GetCurrentUserId(),
                WalletId = walletId
            });

            return Ok(result);
        }

        /// <summary>
        /// Get a specific transaction by ID.
        /// </summary>
        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(TransactionDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<TransactionDto>> GetById(Guid id)
        {
            var result = await _mediator.Send(new GetTransactionByIdQuery
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
}
