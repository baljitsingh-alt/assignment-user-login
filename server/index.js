import express from "express" 
import userRouter from "./routes/user.route.js";
import {connectDB} from "./config/db.js"
import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

import cors from "cors";


const app = express();

app.use(express.json()); 

connectDB();

app.use(cors({
    origin: ['http://localhost:5173']
}))



app.get("/test", (req, res)=>{
    return res.status(200).json({message:"test route working fine"});
})


app.use("/api/v1", userRouter);


app.listen(3000, (req, res)=>{
console.log("it is working on port 3000");

})