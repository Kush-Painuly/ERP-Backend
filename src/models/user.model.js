import { Schema, model } from "mongoose";
import { LEAVETYPE } from "../enums/LeaveType.js";
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: false,
    },
    role: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Role",
    },
    deptId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Department",
    },
    userPermissions: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "Permission",
      },
    ],
    adhaarCardNo: {
      type: Number,
      required: false,
    },
    panCardNo: {
      type: String,
      required: false,
    },
    profilePic: {
      type: String,
      required: false,
    },
    documents: [
      {
        name: String,
        value: String,
      },
    ],
    totalLeaves: {
      type: Number,
      default: 12,
    },
    leaveRequested: [
      {
        from: Date,
        to: Date,
        reason: String,
        leavetype: { type: String, enum: Object.values(LEAVETYPE) },
        isApproved: Boolean,
      },
    ],
    otpVerification:{
      otp:String,
      otpExpiry:Date
    }
  },
  {
    timestamps: true,
  }
);

export const User = model("User", userSchema);

//document object size - 16MB
