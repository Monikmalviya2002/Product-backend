import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY in .env");
}

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtp = async (email, otp) => {
  try {
    console.log(`📧 Attempting to send OTP to ${email}`);

    const response = await resend.emails.send({
      from: "Productr <noreply@productr.com>", // use your verified domain
      to: email,
      subject: "Your Productr Login OTP",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Login OTP</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing:3px;">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    });

    console.log("✅ OTP email sent! Full Resend response:");
    console.log(JSON.stringify(response, null, 2));

    if (response.id) {
      console.log(`📌 Resend Email ID: ${response.id}`);
    } else {
      console.warn("⚠️ Email may not have been queued properly!");
    }

  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw error;
  }
};

export default sendOtp;
