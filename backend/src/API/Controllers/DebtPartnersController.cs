using API.Middleware;
using Application.Features.DebtPartners;
using Application.Features.DebtPartners.CreateDebtPartner;
using Application.Features.DebtPartners.DeleteDebtPartner;
using Application.Features.DebtPartners.GetDebtPartnerById;
using Application.Features.DebtPartners.GetDebtPartners;
using Application.Features.DebtPartners.UpdateDebtPartner;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace API.Controllers;

[ApiController]
[Authorize]
[Route("api/[controller]")]
public class DebtPartnersController : ControllerBase
{
    private readonly IMediator _mediator;

    public DebtPartnersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    [ProducesResponseType(typeof(DebtPartnerDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<DebtPartnerDto>> Create([FromBody] CreateDebtPartnerCommand command)
    {
        command.UserId = GetCurrentUserId();
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<DebtPartnerDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<IReadOnlyList<DebtPartnerDto>>> GetAll()
    {
        var result = await _mediator.Send(new GetDebtPartnersQuery
        {
            UserId = GetCurrentUserId()
        });

        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(DebtPartnerDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<DebtPartnerDto>> GetById(Guid id)
    {
        var result = await _mediator.Send(new GetDebtPartnerByIdQuery
        {
            Id = id,
            UserId = GetCurrentUserId()
        });

        return Ok(result);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(DebtPartnerDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<DebtPartnerDto>> Update(Guid id, [FromBody] UpdateDebtPartnerCommand command)
    {
        command.Id = id;
        command.UserId = GetCurrentUserId();
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _mediator.Send(new DeleteDebtPartnerCommand
        {
            Id = id,
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
