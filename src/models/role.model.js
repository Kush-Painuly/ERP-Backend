import { Schema,model } from "mongoose";

const userRole = new Schema({
    name:{
        type:String,
        required:true
    },
    isRoleDeleted:{
        type:Boolean,
        default:false
    }
})

export const Role = model("Role", userRole);