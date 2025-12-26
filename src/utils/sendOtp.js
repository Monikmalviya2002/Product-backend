import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();


const resend = new Resend(process.env.RESEND_API_KEY);

const sendOtp = async (email, otp) => {
  try {
    await resend.emails.send({
      from: "Productr <onboarding@resend.dev>",
      to: email,
      subject: "Your Productr Login OTP",
      html: `
        <h2>Login OTP</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    console.log(`✅ OTP email sent to ${email}`);
  } catch (error) {
    console.error("❌ Resend email error:", error);
    throw error;
  }
};

export default sendOtp;
