import { Router } from "express";
import { createDept, getDepts, deleteDepts, updateDepts } from "../controllers/index.js";
import { catchAsync, verifyJWT } from "../middlewares/index.js";
export const deptRoutes = Router();

deptRoutes.post("/create-department",catchAsync(createDept));

deptRoutes.get("/get-departments",catchAsync(getDepts));

deptRoutes.delete("/delete-dept/:deptId", catchAsync(deleteDepts));

deptRoutes.put("/update-dept/:deptId",catchAsync(updateDepts));