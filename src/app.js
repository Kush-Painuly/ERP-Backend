import express from "express";
import "dotenv/config";
import { errorHandler } from "./middlewares/index.js";
import { deptRoutes, roleRoutes, authRoutes, permissionRoutes } from "./routes/index.js";
const app = express();

//built-in middleware
app.use(express.json());

//only for debugging 
app.use((req, res, next) => {
  console.log(req.url);
  next();
});

app.use("/api/dept", deptRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/permission",permissionRoutes);

//express default error handling middleware
app.use(errorHandler);

export default app;
