export const welcomeEmailHtml = (userName: string = 'User') => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Welcome Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
      <table style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <tr>
          <td style="background-color: #1e1e2f; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">🎬 Movie Reservation System</h1>
          </td>
        </tr>
        <tr>
          <td style="padding: 30px;">
            <h2 style="color: #333;">Welcome, ${userName}!</h2>
            <p style="font-size: 16px; color: #555;">
              Thank you for signing up to our Movie Reservation System. We're excited to have you on board!
            </p>
            <p style="font-size: 16px; color: #555;">
              You can now browse movies, check available showtimes, and reserve your favorite seats in just a few clicks.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://yourdomain.com" style="background-color: #1e1e2f; color: #fff; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">
                Go to Dashboard
              </a>
            </div>
            <p style="font-size: 14px; color: #999; text-align: center;">
              If you have any questions, feel free to reply to this email. Happy watching!
            </p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f1f1f1; text-align: center; padding: 15px; font-size: 12px; color: #888;">
            &copy; 2025 Movie Reservation System. All rights reserved.
          </td>
        </tr>
      </table>
    </body>
  </html>
`;