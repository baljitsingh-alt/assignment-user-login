import jwt from "jsonwebtoken"
const jwt_secret = process.env.JWT_SECRET || "secret";

export const isAuthenticated = async(req, res, next)=>{

    console.log("req headers",req.headers.Authorization);
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];


        // console.log("token",token);
        if(!token){
            return res.status(401).json({message:"bearer token is requiored"});
        }

        const decoded = await jwt.verify(token, jwt_secret);
        req.user = decoded.userId;

        next();

    } catch (error) {
        console.log("error in middlware",error)
        return res.status(401).json({message:"invalid token"});
    }


}