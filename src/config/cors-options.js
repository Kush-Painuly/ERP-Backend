import { allowedOrigin } from "./AllowedOrigin.js";

const corsOptions ={
    origin: (origin, callback) =>{
        if(allowedOrigin.indexOf(origin) !== -1 || !origin){
            callback(null, true);
        }else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials:true,
}
export default corsOptions; 