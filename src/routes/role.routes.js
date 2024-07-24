import { Router } from "express";
import { catchAsync } from "../middlewares/HandleErrrors.js";
import { createRole, getRoles, deleteRole,updateRoles } from "../controllers/role.controller.js";
export const roleRoutes = Router();

roleRoutes.post("/create-role", catchAsync(createRole));

roleRoutes.get("/get-roles", catchAsync(getRoles));

roleRoutes.delete("/delete-role/:roleId", catchAsync(deleteRole));

roleRoutes.put("/update-role/:roleId",catchAsync(updateRoles))