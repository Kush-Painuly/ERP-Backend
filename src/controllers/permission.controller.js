import { CustomError } from "../utils/index.js"
import { Permission } from "../models/index.js"

export const createPermission = async(req,res) =>{
    const {permissions} = req.body;

    if(!permissions || permissions.length === 0)
    {
        throw new CustomError("No permissions provided",400)
    }

    const result = await Permission.insertMany(permissions);
    res.status(201).json({
        success:true,
        message: "permission created successfully",
        result
    });
}