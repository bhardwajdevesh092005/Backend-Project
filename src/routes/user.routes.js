import { Router } from "express";
import {loginUser, registerUser} from '../controller/user.controller.js'
import { upload } from "../middleware/multer.middleware.js";
// import { verifyJWT } from "../middleware/auth.middleware.js";
const userRoutes = Router()
userRoutes.post('/register',
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1,
        }
    ]),
    registerUser)
userRoutes.post('/login',loginUser);
export default userRoutes;