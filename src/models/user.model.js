import mongoose, {Schema} from 'mongoose'
import {email_validator} from '../utils/Validators.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        validate: {
            validator: email_validator,
            message: props=>{`${props.value} is not a valid email address`}
        }
    },
    fullName: {
        type: String,
        required: true,
    },
    avatar: {
        type: String, // Cloudinary URL
        required: false,
    },
    coverImage: {
        type: String,
        required: false,
    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "Video",

    }],
    password: {
        type: String,
        required: [true, "Password is a required field"]
    },
    refreshToken: {
        type: String
    }

},{timestamps:true})

userSchema.pre('save', async function(next){
    if(!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAuthToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email 
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)