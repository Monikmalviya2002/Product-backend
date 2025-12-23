import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import OTP from "../models/otp.js";
import generateOtp from "../utils/generateOtp.js";
import sendOtp from "../utils/sendOtp.js";
dotenv.config();

         const authRouter = express.Router();
    
         authRouter.post("/send-otp", async (req, res) => {
                try {
             const { emailId } = req.body;
          if (!emailId) return res.status(400).json({ error: "Email is required" });
          let user = await User.findOne({ emailId });
          if (!user) user = await User.create({ emailId });

    
        await OTP.deleteMany({ identifier: emailId, purpose: "LOGIN" });

    
         const otp = generateOtp();
         const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

            await OTP.create({
             identifier: emailId,
           otp,
           purpose: "LOGIN",
            isVerified: false,
           expiresAt,
            });

           await sendOtp(emailId, otp);

             res.json({ message: "OTP sent successfully" });
             } catch (err) {
          res.status(400).json({ error: err.message });
           }
           });

         authRouter.post("/verify-otp", async (req, res) => {
             try {
            const { otp } = req.body;
            if (!otp) return res.status(400).json({ error: "OTP is required" });

            const otpRecord = await OTP.findOne({
                otp: String(otp).trim(),
             purpose: "LOGIN",
          expiresAt: { $gt: new Date() },
            }).sort({ createdAt: -1 });

       if (!otpRecord) return res.status(400).json({ error: "OTP not found or expired" });

           const { identifier: emailId } = otpRecord; 

            await OTP.deleteOne({ _id: otpRecord._id });

             const user = await User.findOneAndUpdate(
            { emailId },
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


         authRouter.post("/resend-otp", async (req, res) => {
         try {
         const { emailId} = req.body;
            const identifier = emailId ;

       if (!identifier) {
      return res.status(400).json({ error: "Email  required" });
    }

  
    await OTP.deleteMany({ identifier, purpose: "LOGIN" });

   
    const otp = generateOtp(); 
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

   
    await OTP.create({
        identifier,
      otp,
        purpose: "LOGIN",
      expiresAt,
    });

    
    await sendOtp(identifier, otp);

    res.json({ message: "OTP resent successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


         authRouter.post("/logout", (req, res) => {
             res.cookie("token", null, {
             expires: new Date(Date.now()),
              });

          res.send("Logged out successfully");
               });

export default authRouter;
