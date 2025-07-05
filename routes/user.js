import { Router } from "express";
import { getUserProfile, getUserProfiles, registerUser, updateUserProfile, userLogin, userLogout } from "../controllers/user.js";
import { checkBlacklist, hasPermission, isAuthenticated } from "../middlewares/auth.js";

const userRouter = Router();

//Public Routes
userRouter.post('/user/signup', registerUser);
userRouter.post('/user/login', userLogin);

//Protected Routes
userRouter.post('/user/logout', isAuthenticated, userLogout);

userRouter.get('/user/me', isAuthenticated, checkBlacklist, hasPermission('viewProfile'), getUserProfile);

userRouter.get('/users', isAuthenticated, hasPermission('viewProfiles'), getUserProfiles);

userRouter.patch('/users/update', isAuthenticated, hasPermission('updateProfiles'), updateUserProfile)



export default userRouter;