import mongoose from "mongoose";

const uri = process.env.DB_URI || "mongodb://localhost:27017/testdb";
console.log("dn, uri",uri)

export const connectDB = ()=>{   
    mongoose.connect(uri).then(()=>{
        console.log("connected to the mongodb");
    }).catch((e)=>{
        console.log("connection db error",e);
        
    })
}