using System.Net;
using System.Net.Mail;
using Application.Common.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Application.Common.Email;

public class GmailEmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<GmailEmailService> _logger;

    public GmailEmailService(IConfiguration configuration, ILogger<GmailEmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendPasswordResetEmailAsync(string toEmail, string username, string resetLink, CancellationToken cancellationToken = default)
    {
        var smtpHost = _configuration["Smtp:Host"] ?? "smtp.gmail.com";
        var smtpPortStr = _configuration["Smtp:Port"] ?? "587";
        var senderEmail = _configuration["Smtp:SenderEmail"];
        var senderName = _configuration["Smtp:SenderName"] ?? "MA6 Debt";
        var appPassword = _configuration["Smtp:AppPassword"];

        if (string.IsNullOrWhiteSpace(senderEmail) || string.IsNullOrWhiteSpace(appPassword))
        {
            _logger.LogWarning("[GmailEmailService] SMTP credentials not configured in appsettings. Logged Reset Link: {ResetLink} for user: {Username}", resetLink, username);
            return;
        }

        int.TryParse(smtpPortStr, out var smtpPort);
        if (smtpPort == 0) smtpPort = 587;

        var subject = "[MA6 Debt] Password Reset Request";
        var body = $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8' />
    <style>
        body {{ font-family: 'Segoe UI', Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; }}
        .container {{ max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }}
        .header {{ text-align: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 24px; }}
        .header h2 {{ color: #0f172a; margin: 0; font-size: 24px; }}
        .content {{ font-size: 15px; color: #334155; line-height: 1.6; }}
        .btn-container {{ text-align: center; margin: 32px 0; }}
        .btn {{ background-color: #2563eb; color: #ffffff !important; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; display: inline-block; box-shadow: 0 2px 4px rgba(37,99,235,0.2); }}
        .footer {{ font-size: 12px; color: #94a3b8; text-align: center; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 16px; }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>MA6 Debt</h2>
        </div>
        <div class='content'>
            <p>Hello <strong>{WebUtility.HtmlEncode(username)}</strong>,</p>
            <p>We received a request to reset the password for your MA6 Debt account.</p>
            <p>Please click the button below to set a new password. This reset link will expire in <strong>15 minutes</strong>:</p>
            <div class='btn-container'>
                <a href='{WebUtility.HtmlEncode(resetLink)}' class='btn'>Reset Password</a>
            </div>
            <p>Or copy and paste this URL into your browser:</p>
            <p style='word-break: break-all; color: #2563eb;'>{WebUtility.HtmlEncode(resetLink)}</p>
            <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
        </div>
        <div class='footer'>
            &copy; {DateTime.UtcNow.Year} MA6 Debt App. All rights reserved.
        </div>
    </div>
</body>
</html>";

        try
        {
            using var message = new MailMessage();
            message.From = new MailAddress(senderEmail, senderName);
            message.To.Add(new MailAddress(toEmail));
            message.Subject = subject;
            message.Body = body;
            message.IsBodyHtml = true;

            using var smtpClient = new SmtpClient(smtpHost, smtpPort);
            smtpClient.Credentials = new NetworkCredential(senderEmail, appPassword);
            smtpClient.EnableSsl = true;

            await smtpClient.SendMailAsync(message, cancellationToken);
            _logger.LogInformation("[GmailEmailService] Successfully sent password reset email to {ToEmail}", toEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[GmailEmailService] Failed to send password reset email to {ToEmail}. Reset link was: {ResetLink}", toEmail, resetLink);
        }
    }
}
