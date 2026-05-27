import mongoose from "mongoose";
import env from 'dotenv'
env.config({path:".env"});

const uri = process.env.DB_URI 
//|| "mongodb://localhost:27017/testdb";

export const connectDB = ()=>{   
    console.log("dn, uri",uri)
    mongoose.connect(uri).then(()=>{
        console.log("connected to the mongodb");
    }).catch((e)=>{
        console.log("connection db error",e);
        
    })
}