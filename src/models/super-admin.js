// src/models/super-admin.js
import mongoose, { Schema } from "mongoose";

const superAdminSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    password: {
      type: String,
      trim: true,
      default: "",
    },
    profilePicture: {
      type: String,
      trim: true,
      default: "",
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    isSubAdmin: {
      type: Boolean,
      default: false,
    },
    permission: [
      {
        type: String,
        default: "",
      },
    ],
    role: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

// ✅ Safe model initialization (avoids recompilation errors)
const SuperAdmin =
  mongoose.models?.SuperAdmin || mongoose.model("SuperAdmin", superAdminSchema);

export default SuperAdmin;
