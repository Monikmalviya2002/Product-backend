import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    emailId: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true, // 🔥 allows null
    },

    phone: {
      type: String,
      unique: true,
      sparse: true, // 🔥 allows null
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
