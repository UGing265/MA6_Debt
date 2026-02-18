using API.Middleware;
using API.Contracts.Transactions;
using Application.Features.Transactions;
using Application.Features.Transactions.CashAdjustment;
using Application.Features.Transactions.DeleteTransaction;
using Application.Features.Transactions.GetTransactionById;
using Application.Features.Transactions.GetTransactions;
using Application.Features.Transactions.QuickDeduct;
using Application.Features.Transactions.UpdateTransactionNote;
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
        [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<QuickDeductResponse>> QuickDeduct([FromBody] QuickDeductRequest request)
        {
            var command = new QuickDeductCommand
            {
                UserId = GetCurrentUserId(),
                WalletId = request.WalletId,
                PartnerId = request.PartnerId,
                PayerMode = request.PayerMode,
                Total = request.Total,
                DebtAmount = request.DebtAmount,
                Note = request.Note,
                TransactionDate = request.TransactionDate
            };

            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result.Transaction.Id }, result);
        }

        /// <summary>
        /// Create a cash adjustment transaction (add/subtract wallet balance).
        /// Personal-only flow: no partner, no debt, note required.
        /// </summary>
        [HttpPost("adjustment")]
        [ProducesResponseType(typeof(TransactionDto), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<TransactionDto>> CashAdjustment([FromBody] CashAdjustmentRequest request)
        {
            var command = new CreateCashAdjustmentCommand
            {
                UserId = GetCurrentUserId(),
                WalletId = request.WalletId,
                Direction = request.Direction,
                Amount = request.Amount,
                Note = request.Note,
                TransactionDate = request.TransactionDate
            };

            var result = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

        /// <summary>
        /// Get all transactions for the current user, optionally filtered by wallet and keyword search.
        /// </summary>
        /// <param name="walletId">Optional wallet identifier. When provided, returns only transactions in that wallet.</param>
        /// <param name="search">Optional keyword filter (case-insensitive) applied to transaction note and debt partner name.</param>
        [HttpGet]
        [ProducesResponseType(typeof(IReadOnlyList<TransactionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IReadOnlyList<TransactionDto>>> GetAll([FromQuery] Guid? walletId, [FromQuery] string? search)
        {
            var result = await _mediator.Send(new GetTransactionsQuery
            {
                UserId = GetCurrentUserId(),
                WalletId = walletId,
                SearchTerm = search
            });

            return Ok(result);
        }

        [HttpPut("{id:guid}/note")]
        [ProducesResponseType(typeof(TransactionDto), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<TransactionDto>> UpdateNote(Guid id, [FromBody] UpdateTransactionNoteRequest request)
        {
            var result = await _mediator.Send(new UpdateTransactionNoteCommand
            {
                UserId = GetCurrentUserId(),
                Id = id,
                Note = request.Note
            });

            return Ok(result);
        }

        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Delete(Guid id)
        {
            await _mediator.Send(new DeleteTransactionCommand
            {
                UserId = GetCurrentUserId(),
                Id = id
            });

            return NoContent();
        }

        /// <summary>
        /// Get a specific transaction by ID.
        /// </summary>
        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(TransactionDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status500InternalServerError)]
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
