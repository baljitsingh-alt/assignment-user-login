import express from "express";
const router = express.Router(); 
import {chnagePassword, getMyProfile, loginUser, logoutUser, registerUser, updateMyProfile} from "../controller/user.controller.js";
import {isAuthenticated} from "../middleware/auth.middleware.js"

router.get("/get-user", (req, res)=>{
    return res.status(200).json({message:"get-user working fine"});
})

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/logout", logoutUser);
router.get("/user/me", isAuthenticated, getMyProfile);
router.put("/user/me", updateMyProfile);
router.post("/user/change-password", chnagePassword);

export default router;