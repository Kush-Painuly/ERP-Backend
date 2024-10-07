import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./config/cors-options.js";
import { errorHandler } from "./middlewares/index.js";
import { deptRoutes, roleRoutes, authRoutes, permissionRoutes, userRoutes } from "./routes/index.js";
const app = express();

//built-in middleware
app.use(express.json());

//security-mechanism package.
app.use(cors(corsOptions));
app.use(cookieParser());

//only for debugging 
app.use((req, res, next) => {
  console.log(req.url);
  next();
});

//manual setup of cors policy
// app.use(res,res,next)=>{
//   res.setHeaders("Access-Control-Allow-origin", "http://localhost:3000");
//   res.setHeaders("Access-Control-Allow-Headers", "Content-Type");
//   res.setHeaders("Access-Control-Allow-Credentials", "true");
// next();
// }

app.use("/api/dept", deptRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/permission",permissionRoutes);
app.use("/api/user",userRoutes);

//express default error handling middleware
app.use(errorHandler);

export default app;

