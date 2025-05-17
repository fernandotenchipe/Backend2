import mongoose from 'mongoose';	

export const connectDB = async () => {
    console.log("🔍 ENV keys:", Object.keys(process.env));
console.log("🧪 MONGO_URL:", process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL)
    console.log('MongoDB connected')
}