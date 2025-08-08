import mongoose from 'mongoose'
import {DB_NAME} from '../constants.js'
import dotenv from 'dotenv'
dotenv.config()
mongoose.set('runValidators',true)
const connectDB = async ()=>{
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(conn.connection.host);
    } catch (error) {
        console.log("Could not connect to databse becuase of: ",error);
        process.exit(1);
    }
}
export default connectDB;
/* 
For testing purpose ->
connectDB();    
*/