import { Router } from "express";
import { catchAsync } from "../middlewares/HandleErrrors.js";
import {
  registerUser,
  login,
  getNewAcessToken,
  logout,
  forgotPassword,
  verifyOTP,
  resetPassword,
} from "../controllers/index.js";

export const authRoutes = Router();

authRoutes.post("/register", catchAsync(registerUser));

authRoutes.post("/login", catchAsync(login));

authRoutes.get("/refresh", catchAsync(getNewAcessToken));

authRoutes.post("/logout", catchAsync(logout));

authRoutes.post("/forgot-password", catchAsync(forgotPassword));
authRoutes.post("/verify-otp", catchAsync(verifyOTP));
authRoutes.post("/reset-password", catchAsync(resetPassword));
