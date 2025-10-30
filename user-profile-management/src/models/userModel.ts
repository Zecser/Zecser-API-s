import mongoose, { Schema, model } from "mongoose";
import { IuserProfile } from "../interfaces/userInterface"
import { userProfileDatas } from "../seed/userProfileData"

const userProfileSchema = new Schema<IuserProfile>({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String },
    age: { type: Number },
    address: {
        state: { type: String },
        district: { type: String },
        city: { type: String },
        pincode: { type: String }
    },
    nationality: { type: String },
    isActive: { type: Boolean, default: false },

}, { timestamps: true })

const userProfileModel = model<IuserProfile>('User', userProfileSchema);

export default userProfileModel


// upload seed data to db

async function insertUserProfile(): Promise<void> {

    try {
        await userProfileModel.deleteMany({})

        const userProfile = userProfileDatas;

        await userProfileModel.insertMany(userProfile)
        console.log("document inserted successfully")

    } catch (error) {
        console.log(error)
    } finally {
        mongoose.disconnect()
    }

}


// insertUserProfile()