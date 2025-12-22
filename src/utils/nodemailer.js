import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password
  },
});

const sendOtp = async (identifier, otp) => {
  // if identifier is phone, skip email sending
  if (!identifier.includes("@")) {
    console.log(`OTP for ${identifier}: ${otp}`);
    return;
  }

  const mailOptions = {
    from: `"Productr" <${process.env.EMAIL_USER}>`,
    to: identifier,
    subject: "Your Productr Login OTP",
    html: `
      <div style="font-family: Arial, sans-serif">
        <h2>Login Verification</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing: 3px">${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
        <p>If you didn’t request this, please ignore.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);

  console.log(`OTP email sent to ${identifier}`);
};

export default sendOtp;
