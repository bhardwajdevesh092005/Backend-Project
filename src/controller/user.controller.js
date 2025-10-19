import {asyncHandler} from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';
export const registerUser = asyncHandler(async (req,res)=>{
    // Extract the details of the user
    // Check if all the details necessary are available
    // Check if the user does not already exist by username
    // Check for images ---> upload to cloudinary
    // Create a new user
    // Register the user in the database
    // Remove the password and refresh token from the response 
    // return the response to the user
    const Data = req.body;
    console.log(Data);
    const {fullName, username, email, password } = Data;

    if(
        [fullName, username, email, password].some((field)=>field?.trim() === "")
    ){
        throw new ApiError(400, "All the fields are required")
    }

    const existingUser =  await User.findOne({
        $or: [{ username },{ email }]
    })
    if(existingUser){
        throw new ApiError(409,"User with email or username already exists");
    }
    const avPath = req.files?.avatar[0].path;
    const covPath = req.files?.coverImage?.[0].path;

    if(!avPath){
        throw new ApiError(400,"Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avPath);
    let coverImage = null;
    if(covPath){
        coverImage = await uploadOnCloudinary(covPath);
    }
    console.log(
        {
            fullName,
            avatar:avatar.url,
            email,
            coverImage: coverImage?.url||"",
            username: username.toLowerCase(),
            password,
        }
    )
    const user = await User.create({
        fullName,
        email,
        avatar:avatar.url,
        coverImage: coverImage?.url||"",
        username: username.toLowerCase(),
        password,
        
    })
    const resp = await User.findById(user._id).select("-password -refreshToken");
    if(!resp){
        throw new ApiError(500,"Something wen twring while registering the user");
    }

    return res.status(201).json(new ApiResponse(
        201,
        "User created successfully",
        resp
    ));
})

const generateAccessandRefreshTokens = async function(userId){
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAuthToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return {accessToken,refreshToken};  
    } catch (error) {
        throw new ApiError("Something went wrong while generating tokens")
    }
}

export const loginUser = asyncHandler(async (req,res)=>{
    // Extract the details from the eq
    // check for username and email
    // find the user
    // check the password
    // generate access and refresh token 
    // send them in cookies
    const {email,username,password} = req.body;
    if(!username && !email){
        throw new ApiError(400,"Atleast one of the email or username is required");
    }   
    const user = await User.findOne({
        $or: [{username},{email}]
    })

    if(!user){
        throw new ApiError(400,"User does not exist");
    }
    if(!(await user.isPasswordCorrect(password))){
        throw new ApiError(401,"Incorrect Password");
    }
    const {accessToken,refreshToken} = await generateAccessandRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    
    const options = {
        httpOnly : true,
        secure: true,
    }

    return (
        res.status(200).
        cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(
                200,
                "loggedInSuccessFully",
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                }
            )
        )
    )

})

export const logOutUser = asyncHandler(async (req,res)=>{
    
})