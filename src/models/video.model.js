import mongoose,{Schema} from 'mongoose'

const videoSchema = new Schema({
    videoFile:{
        type: String, // cloudinary string
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    thumbnail: {
        type: String, //Cloudinary URL
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    views: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        required: true,
    }
    
},{timestamps:true})

export const Video = mongoose.model("Video",videoSchema)