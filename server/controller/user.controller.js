import User from "../model/user.model.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const registerUser = async(req, res)=>{

    // console.log("req is comming");
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

        const refresh_token = jwt.sign({userId:user._id}, process.env.REFRESH_SECRET, {expiresIn:'1hr'}) //1 hour
        const access_token = jwt.sign({userId:user._id}, process.env.ACCESS_SECRET, {expiresIn:'5min'}) //5 min


        res.cookie('jwt', refresh_token, {
            httpOnly: true,
            secure:true,
            sameSite: 'strict',
            maxAge:1000*60*60// 1 hr in sec
        });

        return res.status(200).json({message:"successfully logged in", access_token});

    } catch (error) {
        console.log("error",error);
        return res.status(500).json({message:"internal server error white login"});
    }
    
}
export const logoutUser = (req, res)=>{

}

export const refreshToken = async(req, res)=>{
    try {
        //it is just to get new access token
        // console.log("req.cookies.jwt", req.cookies.jwt);
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({message:"unauthorized"});

        }
        const decoded = await jwt.verify(token, process.env.REFRESH_SECRET);

        const accessToken = await jwt.sign({userId:decoded.userId}, process.env.ACCESS_SECRET, {expiresIn:"1min"});

        return res.status(200).json({message:"refeshed", access_token:accessToken});



        //decoded 
        // then create new refresh token and send it
    } catch (error) {
        console.log("error",error);
        return res.status(403).json({message:"internal server error"});
    }

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

export const updateMyProfile = async(req, res)=>{
    try {
        const {firstname, lastName, email} = req.body;
        const userId = req.user;

        const toUpdate = {};

        if(firstname){
            toUpdate.firstName = firstName;
        }
        if(lastName){
            toUpdate.lastName = lastName;
        }
        if(email){
            toUpdate.email= email;
        }
        const updatedUser =  await User.findByIdAndUpdate(userId, toUpdate, {new :true, runValidators:true})
        return res.status(200).json({message:"updated", user:updatedUser});

    } catch (error) {
        console.log("error",error);
        if(error.name==='ValidationError'){
            const errorMessage = Object.values(error.errors).map((er)=> ({name:er.name, message:er.message}));// it will return that er.message only
            return res.status(400).json({message:"validation error", errors:errorMessage});
            
        
        }
        return res.status(500).json({message:"internal server error"});
    }

}

export const chnagePassword = async(req, res)=>{

    try {
        const userId = req.user;
        const {currentPassword, newPassword} = req.body;

        if(!currentPassword || !newPassword){
            return res.status(400).json({message:"all field are required"});
        }

        if(newPassword.length<8){
            return res.status(400).json({
                message: "Password must be at least 8 characters",
            });
        }

        const user = await User.findById(userId); // {_id: userId}

        if(!user){
            return res.status(404).json({message:"user not found"});
        }

        const isPasswordMatched = await user.isPasswordMatched(currentPassword);

        if(!isPasswordMatched){
            return res.status(400).json({messsage:"current password is invalid"});
        }

        user.password = newPassword;
        user.save();

        const {password, ...userWithoutPassword} = user.toObject();
        
        return res.status(200).json({message:"password changed", user: userWithoutPassword});

    } catch (error) {
        console.log("error",error);
        return res.status(500).json({message:"internal server error"});
    }
    
}
   