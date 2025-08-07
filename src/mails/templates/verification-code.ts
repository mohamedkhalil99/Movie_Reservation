export function getVerificationEmail(code: string): string {
  return `
    <div style="font-family: Arial, sans-serif; text-align: center;">
      <h1 style="font-weight: bold;">Your verification code is</h1>
      <h2 style="color: green; font-weight: bold;">${code}</h2>
      <p style="margin-top: 30px; font-weight: bold;">Movie Reservation</p>
    </div>
  `;
}