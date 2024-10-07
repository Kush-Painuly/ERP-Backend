import { Router } from "express";
import { catchAsync, upload, verifyJWT } from "../middlewares/index.js";
import { createPermission, getPermissions } from "../controllers/index.js";

export const permissionRoutes = Router();

permissionRoutes.post(
  "/create-permission",
  upload.single("PermissionFile"),
  catchAsync(createPermission)
);

permissionRoutes.get(
  "/",
  //  verifyJWT,
  catchAsync(getPermissions)
);
