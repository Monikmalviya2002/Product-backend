import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js"

dotenv.config();
const app = express();

connectDB();

app.listen(process.env.PORT,()=>{
    console.log("server is active")
});