import { Router } from "express";
import { verifyJWT, catchAsync } from "../middlewares/index.js";
import {
  getusers,
  getAvailableManagers,
  manageUserPermission,
} from "../controllers/index.js";
export const userRoutes = Router();

userRoutes.get("/", verifyJWT, catchAsync(getusers));
userRoutes.get(
  "/available-managers",
  verifyJWT,
  catchAsync(getAvailableManagers)
);

userRoutes.post(
  "/manage-permission",
  //   verifyJWT,
  catchAsync(manageUserPermission)
);
