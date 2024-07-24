import { Router } from "express";
import { catchAsync } from "../middlewares/index.js";
import { createPermission } from "../controllers/index.js";

export const permissionRoutes = Router();


permissionRoutes.post("/create-permission",catchAsync(createPermission));