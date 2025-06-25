//index.js
import express from "express";
import dotenv from "dotenv";
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import promtRoutes from "./routes/promt.route.js";


dotenv.config();
const app = express();
const port = process.env.PORT || 4001;
const MONGO_URL = process.env.MONGO_URI;

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST","PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);


//DB Connection code goes here!!
mongoose.connect(MONGO_URL)
    .then(() => console.log("Connected to mongoDB"))
    .catch((error) => console.error("MongoDB Connection error:", error));

//routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/deepseekai",promtRoutes);



app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
})
