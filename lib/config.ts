export const config = {
  BASE_URL: process.env.BASE_URL || "http://localhost:3000",
  resend: {
    RESEND_API_KEY: process.env.RESEND_API_KEY || "",
    WEBSITE_EMAIL_ADDRESS:
      process.env.WEBSITE_EMAIL_ADDRESS || "Ripl <onboarding@resend.dev>",
  },
};
