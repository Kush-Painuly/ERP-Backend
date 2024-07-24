import { CustomError } from "../utils/index.js";
import { Department } from "../models/index.js";
export const createDept = async (req, res, next) => {
  const { name } = req.body;
  //santize the values
  if (!name) {
    throw new CustomError("Please fill all the fields", 400);
  }

  const department = await Department.create({ name });

  res.status(201).json({
    success: true,
    department,
    message: "Department Created Successfully",
  });
};

export const getDepts = async (req, res, next) => {
  const departments = await Department.find();
  res.status(200).json({
    success: true,
    data: departments,
  });
};

export const deleteDepts = async(req, res, next) => {
  const { deptId } = req.params;

  const department = await Department.findById(deptId);

  if(!department){
    throw new CustomError("Department does not exist", 400);
  }

  const result = await Department.findByIdAndDelete(deptId);
  
  res
    .status(200)
    .json({ success: true, message: "department deleted successfully!" });
};

export const updatedDepts = async(req, res, next) => {
  const { deptId } = req.params;
  const { name } = req.body;

  if (!name || !deptId) {
    throw new CustomError("Please fill all the fields", 400);
  }

  const existingDept = await Department.findById(deptId); 

  if (!existingDept) {
    throw new CustomError("No department found with this id", 404);
  }

  const result = await Department.findByIdAndUpdate(deptId, {name});
  res
    .status(200)
    .json({ success: true, message: "Department updated successfully" });
};
