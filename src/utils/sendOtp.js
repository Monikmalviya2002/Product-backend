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

const sendOtp = async (email, otp) => {
  const mailOptions = {
    from: `"Productr" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Productr Login OTP",
    html: `<h1>${otp}</h1><p>This OTP is valid for 5 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`OTP sent to ${email}`);
};

export default sendOtp;
