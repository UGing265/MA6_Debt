using Application.Features.Auth.Login;
using Application.Features.Auth.Register;
using MediatR;
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
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var command = new LoginCommand { Username = request.Username, Password = request.Password };
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPost("register")]
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
