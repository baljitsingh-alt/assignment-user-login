import jwt from "jsonwebtoken"

export const isAuthenticated = async(req, res, next)=>{

    // console.log("req headers",req.headers.Authorization);
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if(!token){
            return res.status(401).json({message:"bearer token is requiored"});
        }

        const decoded = await jwt.verify(token, process.env.ACCESS_SECRET);
        req.user = decoded.userId;

        //here also i have refresh the user token

        next();

    } catch (error) {
        console.log("error in middlware",error)
        return res.status(401).json({message:"invalid token"});
    }


}