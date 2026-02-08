using API.Middleware;
using Application.Features.Auth.Login;
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

    public AuthController(IMediator mediator)

    {
        _mediator = mediator;
    }

    [HttpPost("login")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var command = new LoginCommand { Username = request.Username, Password = request.Password };
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("register")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ValidationErrorResponse), StatusCodes.Status409Conflict)]
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
}
