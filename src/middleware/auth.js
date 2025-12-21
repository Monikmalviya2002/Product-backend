import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

const userAuth = async(req,res,next)=>{
    
     try{
      if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
        
        const{token} = req.cookies;
         if (!token) {
        return res.status(401).send("Please login");
        } 
   
      const decodeData = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      const{_id} = decodeData; 
     
      const user = await User.findById(_id);
            if (!user) {
      return res.status(404).send("User doesn't exist");
        }

           if (!user.isVerified) {
      return res.status(403).send("OTP verification required");
    }

    
   req.user = user;
    next();

    }catch(err){
         return res.status(400).send("ERROR: " + err.message);
    }
} 

  export default userAuth;