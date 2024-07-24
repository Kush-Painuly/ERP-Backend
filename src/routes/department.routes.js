import { Router } from "express";
import { createDept, getDepts, deleteDepts, updatedDepts } from "../controllers/index.js";
import { catchAsync } from "../middlewares/HandleErrrors.js";
export const deptRoutes = Router();

deptRoutes.post("/create-department",catchAsync(createDept));

deptRoutes.get("/get-departments",catchAsync(getDepts));

deptRoutes.delete("/delete-dept/:deptId", catchAsync(deleteDepts));

deptRoutes.put("/update-dept/:deptId",catchAsync(updatedDepts));