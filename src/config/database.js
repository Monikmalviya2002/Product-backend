import mongoose  from "mongoose";
import dotenv from "dotenv";

dotenv.config();

  async function connectDB() {
         try{
           await mongoose.connect( process.env.DB_CONNECTION_STRING);
           console.log("Database connection successfull")
         }catch(err){
           console.error("Database connection failed", err);
            
       }
  }

  export default connectDB;