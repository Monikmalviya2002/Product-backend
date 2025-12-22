import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  identifier: String,
  otp: String,
  purpose: {
    type: String,
    enum: ["LOGIN"],
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  expiresAt: Date,
}, { timestamps: true });


  



const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
