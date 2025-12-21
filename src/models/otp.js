import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    identifier: {
      type: String,
      required: true,
      index: true,  
    },

     isVerified: {
      type: Boolean,
      default: false,
    },


    otp: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

  },
  { timestamps: true }
);



const OTP = mongoose.model("OTP", otpSchema);
export default OTP;
