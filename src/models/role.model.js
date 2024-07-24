import { Schema,model } from "mongoose";

const userRole = new Schema({
    name:{
        type:String,
        required:true
    }
})

export const Role = model("Role", userRole);