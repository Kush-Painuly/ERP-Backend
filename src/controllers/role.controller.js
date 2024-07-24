import { CustomError } from "../utils/index.js";
import { Role } from "../models/index.js";
export const createRole = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new CustomError("please fill all the fields", 400);
  }

  const result = await Role.create({ name });
  res.status(201).json({
    success: true,
    message: "Role created Successfully",
  });
};
export const getRoles = async (req, res) => {
  const roles = await Role.find();
  res.status(200).json({
    success: true,
    data: roles,
  });
};

export const deleteRole = async(req,res)=>{
  const {roleId}=req.params;
  const existingRole = await Role.findById(roleId);
  if(!existingRole){
    throw new CustomError("Role does not exist", 500);
  }
  const result = await Role.findByIdAndDelete(roleId);
  res.status(200).json({
    success:true,
    message:"Role deleted successfully"
  })
}

export const updateRoles = async(req,res)=>{
  const {roleId}=req.params;
  const {name}=req.body;
  const existingRole = await Role.findById(roleId);
  if(!existingRole){
    throw new CustomError("Role does not exist",500);
  }
  const result = await Role.findByIdAndUpdate(roleId,{name});
  res.status(200).json({
    success:true,
    message:"Role updated successfully",
  })
  
}
