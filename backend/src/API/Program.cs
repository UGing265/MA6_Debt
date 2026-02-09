using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using Persistence;
using Application;
using Application.Common.Interfaces;
using System.Text;
using Scalar.AspNetCore;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            JsonWebTokenHandler.DefaultInboundClaimTypeMap.Clear();
            //DotNetEnv.Env.Load(); if not using docker
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddCors(options =>
            {
                var allowedOrigins = builder.Configuration["Cors:Origins"];
                options.AddPolicy("AllowReactApp",
                    builder => builder
                        .WithOrigins(allowedOrigins?.Split(',', StringSplitOptions.RemoveEmptyEntries) ?? new[] { "http://localhost:3000" })
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
            });

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi(options =>
            {
                options.AddDocumentTransformer((document, context, cancellationToken) =>
                {
                    document.Components ??= new Microsoft.OpenApi.Models.OpenApiComponents();
                    document.Components.Schemas["ProblemDetails"] = new Microsoft.OpenApi.Models.OpenApiSchema
                    {
                        Type = "object",
                        Properties = new Dictionary<string, Microsoft.OpenApi.Models.OpenApiSchema>
                        {
                            ["type"] = new Microsoft.OpenApi.Models.OpenApiSchema { Type = "string" },
                            ["title"] = new Microsoft.OpenApi.Models.OpenApiSchema { Type = "string" },
                            ["status"] = new Microsoft.OpenApi.Models.OpenApiSchema { Type = "integer" },
                            ["errors"] = new Microsoft.OpenApi.Models.OpenApiSchema
                            {
                                Type = "object",
                                AdditionalProperties = new Microsoft.OpenApi.Models.OpenApiSchema
                                {
                                    Type = "array",
                                    Items = new Microsoft.OpenApi.Models.OpenApiSchema { Type = "string" }
                                }
                            }
                        }
                    };
                    return Task.CompletedTask;
                });
            });

            builder.Services.AddProblemDetails();
            builder.Services.AddExceptionHandler<API.Middleware.GlobalExceptionHandler>();

            builder.Services.AddPersistenceServices(builder.Configuration);

            // Add Application services (MediatR, validators, etc.)
            builder.Services.AddApplicationServices();

            // Configure JWT Authentication
            var jwtSettings = builder.Configuration.GetSection("Jwt");
            var secret = jwtSettings["Secret"];
            var issuer = jwtSettings["Issuer"];
            var audience = jwtSettings["Audience"];

            if (string.IsNullOrEmpty(secret) || string.IsNullOrEmpty(issuer) || string.IsNullOrEmpty(audience))
            {
                throw new InvalidOperationException("JWT settings are not configured in appsettings.json");
            }

            var key = Encoding.UTF8.GetBytes(secret);

            builder.Services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = true,
                        ValidIssuer = issuer,
                        ValidateAudience = true,
                        ValidAudience = audience,
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };
                });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference();
            }

            app.UseCors("AllowReactApp");

            app.UseHttpsRedirection();

            app.UseExceptionHandler();

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
