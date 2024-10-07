import { Schema,model } from "mongoose";

const permissionSchema = new Schema({
    permissionId:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:false
    }
})

export const Permission = model("Permission", permissionSchema);





//npm i xlsx : used to create and read excel files.
// npm i multer : used to upload files directly in the cloud / DB