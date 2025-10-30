import dotenv from "dotenv"
import mongoose from "mongoose"

dotenv.config()

async function connectDB(): Promise<void> {

    const mongoConnection = process.env.MONGO_URI || "mongodb://localhost:27017/user-profile-management"

    try {
        mongoose.connect(mongoConnection)
        console.log("Mongodb connectDB successfully")
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

export default connectDB