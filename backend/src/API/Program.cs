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
