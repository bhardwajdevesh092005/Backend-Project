import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";
import jwt from 'jsonwebtoken';
export const verifyJWT = asyncHandler(async (req,res,next)=>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        
        if(!token){
            throw new ApiError(401,"Unauthorised Request");
        }
        const decoded_info = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded_info._id).select("-password -efreshToken");
        if(!user){
            throw new ApiError(401,"Invalid Access Token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(500,error.message||"Something occured in middleware");
    }
})