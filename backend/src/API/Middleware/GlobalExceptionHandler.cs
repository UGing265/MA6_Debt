using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using System.Text.Json.Serialization;

namespace API.Middleware
{
    public class GlobalExceptionHandler : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger;

        public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
        {
            _logger = logger;
        }

        public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
        {
            if (exception is ValidationException validationException)
            {
                _logger.LogWarning("Validation error occurred: {Message}", validationException.Message);

                var errors = new Dictionary<string, string[]>();
                foreach (var failure in validationException.Errors)
                {
                    if (!errors.ContainsKey(failure.PropertyName))
                    {
                        errors[failure.PropertyName] = new string[] { };
                    }
                    errors[failure.PropertyName] = errors[failure.PropertyName]
                        .Append(failure.ErrorMessage)
                        .ToArray();
                }

                var response = new ValidationErrorResponse
                {
                    Type = "https://tools.ietf.org/html/rfc7231#section-6.5.1",
                    Title = "Validation Error",
                    Status = 400,
                    Errors = errors
                };

                httpContext.Response.StatusCode = 400;
                httpContext.Response.ContentType = "application/json";

                await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);
                return true;
            }
            else if (exception is UnauthorizedAccessException unauthorizedAccessException)
            {
                _logger.LogWarning("Unauthorized access: {Message}", unauthorizedAccessException.Message);

                httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;

                var response = new ValidationErrorResponse
                {
                    Type = "https://tools.ietf.org/html/rfc7231#section-3.1",
                    Title = "Unauthorized",
                    Status = StatusCodes.Status401Unauthorized,
                    Errors = new Dictionary<string, string[]>
                    {
                        { "Unauthorized", new string[] { unauthorizedAccessException.Message } }
                    }
                };

                await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);
                return true;
            }
            else
            {
                _logger.LogError(exception, "An unhandled exception has occurred.");

                httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;

                var response = new ValidationErrorResponse
                {
                    Type = "https://tools.ietf.org/html/rfc7231#section-6.6.1",
                    Title = "Internal Server Error",
                    Status = StatusCodes.Status500InternalServerError,
                    Errors = new Dictionary<string, string[]>
                    {
                        { "InternalServerError", new string[] { "An error occurred while processing your request." } }
                    }
                };

                await httpContext.Response.WriteAsJsonAsync(response, cancellationToken);
                return true;
            }

            return false;
        }
    }

    public class ValidationErrorResponse
    {
        [JsonPropertyName("type")]
        public string Type { get; set; } = string.Empty;

        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonPropertyName("status")]
        public int Status { get; set; }

        [JsonPropertyName("errors")]
        public Dictionary<string, string[]> Errors { get; set; } = new();
    }
}
