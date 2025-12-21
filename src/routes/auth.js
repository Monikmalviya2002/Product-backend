import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import OTP from "../models/otp.js";
import generateOtp from "../utils/generateOtp.js";
import sendOtp from "../utils/sendOtp.js";

dotenv.config();
const authRouter = express.Router();

//* ================= LOGIN (SCREEN 1) ================= */
/* Email / Phone → Send OTP */
authRouter.post("/send-otp", async (req, res) => {
  try {
    const { emailId, phone } = req.body;

    if (!emailId && !phone) {
      return res.status(400).json({
        error: "Email or phone number is required",
      });
    }

    const identifier = emailId || phone;

    

     let user = await User.findOne({
      $or: [{ emailId }, { phone }],
    });

    if (!user) {
      user = await User.create({
        emailId,
        phone,
      });
    }

    // 🔥 delete previous OTPs
    await OTP.deleteMany({ identifier, purpose: "LOGIN" });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await OTP.create({
      identifier,
      otp,
      purpose: "LOGIN",
      expiresAt,
    });

    await sendOtp(identifier, otp);

    res.json({
      message: "OTP sent successfully",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


/* ================= VERIFY OTP (SCREEN 2) ================= */
authRouter.post("/verify-otp", async (req, res) => {
  try {
    const { emailId, phone, otp } = req.body;

    if (!otp || (!emailId && !phone)) {
      return res.status(400).json({ error: "Email/phone and OTP are required" });
    }

    const identifier = emailId || phone;

    // Find latest valid OTP that matches
    const otpRecord = await OTP.findOne({
      identifier,
       isVerified: false,
      otp,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ error: "OTP not found or expired" });
    }

    // Delete OTP after verification
    await OTP.deleteOne({ _id: otpRecord._id });

    const user = await User.findOneAndUpdate(
      { $or: [{ emailId }, { phone }] },
      { isVerified: true },
      { new: true }
    );

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });

    res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= RESEND OTP ================= */
authRouter.post("/resend-otp", async (req, res) => {
  try {
    const { emailId, phone } = req.body;
    const identifier = emailId || phone;

    if (!identifier) {
      return res.status(400).json({ error: "Email or phone required" });
    }

    // 1️⃣ Delete any previous unverified OTPs for this identifier
    await OTP.deleteMany({ identifier, purpose: "LOGIN" });

    // 2️⃣ Generate new OTP
    const otp = generateOtp(); // ensure this is the correct utility function
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // 3️⃣ Save the new OTP
    await OTP.create({
      identifier,
      otp,
      purpose: "LOGIN",
      expiresAt,
    });

    // 4️⃣ Send OTP
    await sendOtp(identifier, otp);

    res.json({ message: "OTP resent successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


/* ================= LOGOUT ================= */
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("Logged out successfully");
});

export default authRouter;
