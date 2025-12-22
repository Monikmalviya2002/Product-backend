import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtp = async (identifier, otp) => {
  try {
    // If identifier is NOT an email (phone), just log it
    if (!identifier.includes("@")) {
      console.log(`OTP for ${identifier}: ${otp}`);
      return;
    }

    const mailOptions = {
      from: `"Productr" <${process.env.EMAIL_USER}>`,
      to: identifier,
      subject: "Your Productr Login OTP",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Login OTP</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing:2px;">${otp}</h1>
          <p>This OTP is valid for 5 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`OTP email sent to ${identifier}`);
  } catch (error) {
    console.error("Error sending OTP email:", error.message);
  }
};

export default sendOtp;
