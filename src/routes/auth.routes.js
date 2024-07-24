import { Router } from "express";
import { catchAsync } from "../middlewares/HandleErrrors.js";
import { registerUser, login} from "../controllers/index.js"

export const authRoutes = Router();

authRoutes.post("/register", catchAsync(registerUser));

authRoutes.post("/login", catchAsync(login));