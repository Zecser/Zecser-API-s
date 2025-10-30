import type { Request, Response } from "express"
import userProfileModel from "../models/userModel"
import { IuserProfile, UserDataValidate, UserProfilePagination } from "../interfaces/userInterface"
import { UserProfileValidation } from "../utils/joivalidation"
import { firstLetterToUpperCase } from "../utils/wordFirstLetterToUppercase"
import { Types } from "mongoose"

// create user profile
export const createUserProfile = async (req: Request<UserDataValidate>,
    res: Response<{ success: boolean, message: string, data?: IuserProfile }>): Promise<void> => {

    //  data validation
    const { error, value } = UserProfileValidation.validate(req.body)

    if (error) {
        res.status(400).json({ success: false, message: error.details[0].message })
        return;
    }


    try {
        // after validation data destructuring  
        const { fullName, email, contactNumber, age, state, district, city, pincode, nationality } = value;


        // To find user already exist to prevent duplicate document creation 
        const userExist = await userProfileModel.findOne({ email })

        if (userExist) {
            res.status(409).json({ success: false, message: "Account already exist" })
            return;
        }

        // word first letter to case function invoke
        const fullNameToUppercase = firstLetterToUpperCase(fullName)
        const stateToUppercase = firstLetterToUpperCase(state)
        const districtToUppercase = firstLetterToUpperCase(district)
        const cityToUppercase = firstLetterToUpperCase(city)
        const nationalityToUppercase = firstLetterToUpperCase(nationality)

        const newUser = new userProfileModel({
            fullName: fullNameToUppercase.trim(),
            email: email.trim(),
            contactNumber,
            age,
            address: {
                state: stateToUppercase,
                district: districtToUppercase,
                city: cityToUppercase,
                pincode
            },
            nationality: nationalityToUppercase
        })

        await newUser.save()

        res.status(201).json({ success: true, message: "User profile create successfully", data: newUser })
    } catch (error: any) {
        res.status(500).json({ success: false, message: "Internal server error" })
        return
    }
}




// fetch user's document
export const getUserProfiles = async (req: Request<{}, null, {}, { limit: string, page: string }>,
    res: Response<UserProfilePagination>): Promise<void> => {

    const page: number = parseInt(req.query.page) || 1;
    const limit: number = parseInt(req.query.limit) || 6;


    try {

        const totalItem = await userProfileModel.countDocuments()
        const totalPages = Math.ceil(totalItem / limit)
        const skip = (page - 1) * limit


        // fetch user's full document 
        const fetchUserProfile = await userProfileModel.find().skip(skip).limit(limit);

        res.status(200).json({ success: true, message: "Data fetch successfully", currentPage: page, totalPages, totalItem, data: fetchUserProfile })
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" })
        return
    }
}

export const getSingleUserProfile = async (req: Request<{ id: string }>,
    res: Response<{ success: boolean, message: string, data?: IuserProfile }>): Promise<void> => {

    const { id } = req.params;

    if (!id) {
        res.status(400).json({ success: false, message: "Id not get" })
        return
    }

    const isValidId: boolean = Types.ObjectId.isValid(id)

    if (isValidId === false) {
        res.status(400).json({ success: false, message: "Invalid User ID format" })
        return;
    }

    try {

        const findsingleUser = await userProfileModel.findById(id);


        if (!findsingleUser) {
            res.status(404).json({ success: false, message: "User profile not found" })
            return
        }

        res.status(200).json({ success: true, message: "Data fetch successfully", data: findsingleUser })

    } catch (error: any) {
        console.log(error)
        res.status(500).json({ success: false, message: "Internal server error" })
        return
    }
}



// update user profile by id
export const updateUserProfile = async (req: Request<any>,
    res: Response<{ success: boolean, message: string, data?: IuserProfile }>): Promise<void> => {

    //  data validation
    const { error, value } = UserProfileValidation.validate(req.body)

    if (error) {
        res.status(400).json({ success: false, message: error.details[0].message })
        return
    }

    const { id } = req.params;

    if (!id) {
        res.status(400).json({ success: false, message: "Id not get" })
        return
    }

    const isValidId: boolean = Types.ObjectId.isValid(id)

    if (isValidId === false) {
        res.status(400).json({ success: false, message: "Invalid User ID format" })
        return;
    }


    try {
        // find user by id 

        const findUserProfileExistById = await userProfileModel.findById(id);


        if (!findUserProfileExistById) {
            res.status(404).json({ success: false, message: "User profile not found" })
            return
        }

        // after validation data destructuring  
        const { fullName, email, contactNumber, age, state, district, city, pincode, nationality } = value;


        // word first letter to case function invoke
        const fullNameToUppercase = firstLetterToUpperCase(fullName)
        const stateToUppercase = firstLetterToUpperCase(state)
        const districtToUppercase = firstLetterToUpperCase(district)
        const cityToUppercase = firstLetterToUpperCase(city)
        const nationalityToUppercase = firstLetterToUpperCase(nationality)


        const updateprofile = await userProfileModel.findByIdAndUpdate(id, {
            fullName: fullNameToUppercase.trim(),
            email: email.trim(),
            contactNumber,
            age,
            address: {
                state: stateToUppercase,
                district: districtToUppercase,
                city: cityToUppercase,
                pincode
            },
            nationality: nationalityToUppercase
        }, { new: true });

        res.status(200).json({ success: true, message: "Data fetch successfully", data: updateprofile })

    } catch (error: any) {
        res.status(500).json({ success: false, message: "Internal server error" })
        return
    }
}



export const deleteUserProfile = async (req: Request<{ id: string }>,
    res: Response<{ success: boolean, message: string }>): Promise<void> => {

    const { id } = req.params

    const isValidId: boolean = Types.ObjectId.isValid(id)

    if (isValidId === false) {
        res.status(400).json({ success: false, message: "Invalid User ID format" })
        return;
    }

    try {

        const findUserProfileExistById = await userProfileModel.findById(id);

        if (!findUserProfileExistById) {
            res.status(404).json({ success: false, message: "User not found" })
            return
        }

        await userProfileModel.findByIdAndDelete(id)

        res.status(200).json({ success: false, message: "User profile delete successfully" })

    } catch (error: any) {
        res.status(500).json({ success: false, message: "Internal server error" })
        return
    }
}