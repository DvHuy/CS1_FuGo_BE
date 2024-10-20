import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

mongoose.set('strictQuery',false);
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI,{
      useNewUrlParser:true,
      useUnifiedTopology:true
  });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Error connecting to MongoDB", err.message);
  }
};

export default connectToMongoDB;
