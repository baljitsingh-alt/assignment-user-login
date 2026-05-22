import User from "../model/user.model.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const jwt_secret = process.env.JWT_SECRET || "secret";

export const registerUser = async(req, res)=>{

    console.log("req is comming");
    try {
        const {firstName, lastName, email, password} = req.body;

        if(!firstName || !lastName || !email || !password){
            return res.status(400).json({message:"all fields are required"});
        }

        console.log("icomming the regster user", firstName, lastName, email, password);

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({message:"user already exist",});
        }

        // let hashPassword;

        // await bcrypt.hash(password, 10, function(err, hash){
        //     if(err){
        //         console.log("error while generating the hashs passwod");
        //     }

        //     console.log("encrypted password",hash);
        //     hashPassword = hash;
        //     console.log("hashpasspwrd",hashPassword);
        // })

        
        const createdUser = await User.create({
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:password // have to hash it later
        })

        createdUser.save();


        return res.status(200).json({message:"user created successfully", user:{firstName, lastName, email}});

    } catch (error) {
        console.log("error in register user", error);

        return res.status(500).json({message:"got some intername errlr"});
    }
}

export const loginUser = async(req, res)=>{
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message:"email and passwod is required"});
        }

        const user = await User.findOne({email});

        
        if(!user){
            return res.status(400).json({message:"invalid credentials!"});
        }
        console.log("user", user);
        
        const isPasswodMatched = await user.isPasswordMatched(password);

        console.log("isPasswodMatched",isPasswodMatched);

        if(!isPasswodMatched){
            return res.status(401).json({message:"Invalid credentials!"});
        }

        const token = jwt.sign({userId:user._id}, jwt_secret, {expiresIn:60*60});

            //login the user with sending the jwt token
        return res.status(200).json({message:"successfully logged in", token})


    } catch (error) {
        console.log("error",error);
        return res.status(500).json({message:"internal server error white login"});
    }
    
}
export const logoutUser = (req, res)=>{

}
export const getMyProfile = async(req, res)=>{
    try {
        const userId = req.user;

        const user = await User.findById({_id:userId});

        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        const userProfile = user;
        delete userProfile.password;

        return res.status(200).json({message:'successfully fetched profile', userProfile});

    } catch (error) {
        console.log("error",error);
        return res.status(500).json({message:"failed to fetch the user profile"});
    }

}

export const updateMyProfile = (req, res)=>{

}

export const chnagePassword = (req, res)=>{
    
}
   