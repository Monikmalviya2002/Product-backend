import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js"
import authRouter from "./routes/auth.js";
import cors from "cors"
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());



app.use("/api", authRouter);

connectDB();

app.listen(process.env.PORT,()=>{
    console.log("server is active")
});