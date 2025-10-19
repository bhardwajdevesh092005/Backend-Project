import dotenv from 'dotenv'
import connectDB from './db/db.js';
import { app } from './app.js';
dotenv.config();

connectDB().then(()=>{
    app.listen(process.env.PORT||8000, ()=>{
        console.log("Server is listening on port",process.env.PORT||8000);
    })      
}).catch((err)=>{console.log("Could not connect to the database in the index.js file due to :",err)})


