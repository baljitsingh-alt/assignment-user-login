import express from "express";
const router = express.Router(); 
import {chnagePassword, getMyProfile, loginUser, logoutUser, refreshToken, registerUser, updateMyProfile} from "../controller/user.controller.js";
import {isAuthenticated} from "../middleware/auth.middleware.js"

router.get("/get-user", (req, res)=>{
    return res.status(200).json({message:"get-user working fine"});
})

router.post("/auth/register", registerUser);
router.post("/auth/login", loginUser);
router.post("/auth/logout", isAuthenticated, logoutUser);
router.post("/auth/refresh", isAuthenticated, refreshToken)
router.get("/user/me", isAuthenticated, getMyProfile);
router.put("/user/me", isAuthenticated, updateMyProfile);
router.patch("/user/change-password", isAuthenticated, chnagePassword);

export default router;