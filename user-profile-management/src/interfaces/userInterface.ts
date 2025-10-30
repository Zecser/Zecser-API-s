

export interface IuserProfile {

    fullName: string,
    email: string,
    contactNumber: string,
    age: number,
    address: {
        state: string,
        district: string,
        city: string,
        pincode: string
    },
    nationality: string,
    isActive: boolean,
}

export interface UserDataValidate {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String },
    age: { type: Number },
    state: { type: String },
    district: { type: String },
    city: { type: String },
    pincode: { type: String }
    nationality: { type: String },
}

export interface UserProfilePagination {
    success: boolean,
    message: string,
    currentPage?: number,
    totalPages?: number,
    totalItem?: number,
    data?: IuserProfile[]
}