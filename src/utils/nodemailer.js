
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtp = async (identifier, otp) => {
  // check if identifier is email
  const isEmail = identifier.includes("@");

  if (!isEmail) {
    // phone logic (SMS) can go here later
    console.log(`OTP for ${identifier}: ${otp}`);
    return;
  }

  const mailOptions = {
    from: `"Productr" <${process.env.EMAIL_USER}>`,
    to: identifier,
    subject: "Your Productr Login OTP",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Login OTP</h2>
        <p>Your OTP for logging into <b>Productr</b> is:</p>
        <h1 style="letter-spacing: 2px;">${otp}</h1>
        <p>This OTP is valid for <b>5 minutes</b>.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendOtp;
