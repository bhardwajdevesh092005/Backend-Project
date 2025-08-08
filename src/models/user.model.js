import mongoose, {Schema} from 'mongoose'
import {email_validator} from '../utils/Validators.js'
const userScehma = new Schema({
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
        required: true,
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
    refreshTokens: {
        type: String
    }

},{timestamps:true})

export const User = mongoose.model("User",userScehma)