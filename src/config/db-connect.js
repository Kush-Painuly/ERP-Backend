import mongoose from "mongoose";
import { CustomError } from "../utils/index.js";

export const dbConnect = async()=>{
    try{
        await mongoose.connect(process.env.DB_URI);
        console.log('Connected to the database successfully :)')
    }
    catch(error){
        throw new CustomError("Unable to connect to this database", 500);
    }
}