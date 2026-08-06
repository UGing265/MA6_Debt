using API.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using Persistence;
using Persistence.Data;
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

            var configuredOrigins = builder.Configuration["Cors:Origins"];
            var allowedOrigins = configuredOrigins?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                ?? new[] { "http://localhost:3000" };
            var trustedOrigins = allowedOrigins
                .Select(origin => origin.TrimEnd('/'))
                .ToHashSet(StringComparer.OrdinalIgnoreCase);
            var accessTokenCookieName = AuthCookieOptions.GetAccessTokenName(builder.Configuration);

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReactApp",
                    builder => builder
                        .WithOrigins(allowedOrigins)
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials());
            });

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

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
                    options.Events = new JwtBearerEvents
                    {
                        OnMessageReceived = context =>
                        {
                            var hasBearerHeader = context.Request.Headers.Authorization
                                .Any(value => value?.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase) == true);

                            if (!hasBearerHeader && context.Request.Cookies.TryGetValue(accessTokenCookieName, out var accessToken))
                            {
                                context.Token = accessToken;
                            }

                            return Task.CompletedTask;
                        }
                    };
                });

            var app = builder.Build();

            // Auto-migrate database in Development and Staging environments
            using (var scope = app.Services.CreateScope())
            {
                var env = scope.ServiceProvider.GetRequiredService<IHostEnvironment>();
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
                var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

                if (env.IsDevelopment() || env.IsEnvironment("Staging"))
                {
                    logger.LogInformation("{Environment} environment detected - applying pending migrations", env.EnvironmentName);
                    try
                    {
                        dbContext.Database.Migrate();
                        logger.LogInformation("Database migrations applied successfully");
                    }
                    catch (Exception ex)
                    {
                        logger.LogError(ex, "Failed to apply database migrations");
                        throw;
                    }
                }
                else
                {
                    logger.LogInformation("{Environment} environment - skipping auto-migration", env.EnvironmentName);
                }
            }

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.MapScalarApiReference();
            }

            if (!app.Environment.IsDevelopment())
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            app.UseCors("AllowReactApp");

            app.Use(async (context, next) =>
            {
                if (HttpMethods.IsPost(context.Request.Method)
                    || HttpMethods.IsPut(context.Request.Method)
                    || HttpMethods.IsPatch(context.Request.Method)
                    || HttpMethods.IsDelete(context.Request.Method))
                {
                    var origin = context.Request.Headers.Origin.ToString();
                    var referer = context.Request.Headers.Referer.ToString();

                    if (!IsTrustedRequestOrigin(origin, referer, trustedOrigins))
                    {
                        context.Response.StatusCode = StatusCodes.Status403Forbidden;
                        return;
                    }
                }

                await next();
            });


            app.UseExceptionHandler();

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }

        private static bool IsTrustedRequestOrigin(string origin, string referer, IReadOnlySet<string> trustedOrigins)
        {
            if (!string.IsNullOrWhiteSpace(origin))
            {
                return trustedOrigins.Contains(origin.TrimEnd('/'));
            }

            if (Uri.TryCreate(referer, UriKind.Absolute, out var refererUri))
            {
                return trustedOrigins.Contains(refererUri.GetLeftPart(UriPartial.Authority).TrimEnd('/'));
            }

            return false;
        }
    }
}
