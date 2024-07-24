import bcrypt from "bcryptjs"
import { CustomError } from "../utils/index.js";
import { User, Role, Department, Permission } from "../models/index.js";


const hashPassword = async(password)=>{
    const saltRounds = 10
    return await bcrypt.hash(password, saltRounds);
}


const createAdmin = async(email,password) =>{
    //create role
    const role = await Role.create({name: "Admin"});

    //create departement
    const dept = await Department.create({name: "Management"});

    //hash the password
    const hashedPassword = await hashPassword(password);

    //fetch admin permissions
    const permissions = await Permission.find({name:"Administrator Access"}).select("_id");

    //create adminUser
    const user = await User.create({
        email,
        password: hashedPassword,
        role: role._id,
        deptId: dept._id,
        userPermissions: permissions
    });

    return user;

}

export const login = async(req,res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        throw new CustomError("Please fill all the fields",400);
    }

    const existingUser = await User.find();
    if(existingUser.length === 0){
        const user = await createAdmin(email,password);

        if(user){
            return res.status(201).json({
                success:true,
                message:"Admin created Successfully"
            })
        }
    }
}

export const registerUser =(req,res)=>{}