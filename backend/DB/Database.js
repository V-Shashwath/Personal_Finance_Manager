import mongoose from "mongoose";

export const connectDB = async (req, res) => {
    try{
        const connection = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true
        });
        console.log("MongoDB Connected Successfully");
    }
    catch(err){
        console.log(err);
    }
}