import Joi from "joi";
import { UserDataValidate } from "../interfaces/userInterface"



export const UserProfileValidation = Joi.object<UserDataValidate>({
    fullName: Joi.string().pattern(/^[A-Za-z\s]+$/).required().min(3).max(20).messages({
        'string.required': 'FullName is required',
        'string.base': 'FullName must be a string',
        'string.empty': 'FullName cannot be empty',
        'string.min': 'FullName must be at least 3 characters long',
        'string.max': 'FullName must be at most 30 characters long',
        'string.pattern.base': 'Username can contain only letters',
    }),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
        'string.required': 'Email is required',
        'string.base': 'Email must be a string',
        'string.empty': 'Email cannot be empty',
        'string.email': 'Email must be a valid email address',

    }),
    contactNumber: Joi.string().pattern(/^[0-9]{10,14}$/).required().messages({
        'string.required': 'Phone number is required',
        'string.base': 'Phone number must be a string',
        'string.empty': 'Phone number cannot be empty',
        'string.pattern.base': 'Phone number must be between 10 to 14 digits ',
    }),
    age: Joi.number().integer().min(18).max(90).required().messages({
        'any.required': 'Age is a mandatory field.',
        'number.base': 'Age must be a number.',
        'number.integer': 'Age must be an integer.',
        'number.min': 'You must be at least 18 years old.',
        'number.max': 'Age cannot exceed 90 years.'
    }),

    state: Joi.string().pattern(/^[A-Za-z\s]+$/).required().min(3).max(30).messages({
        'string.required': 'State is required',
        'string.base': 'State must be a string',
        'string.empty': 'State cannot be empty',
        'string.min': 'State must be at least 3 characters long',
        'string.max': 'State must be at most 30 characters long',
        'string.pattern.base': 'State can contain only letters',
    }),
    district: Joi.string().pattern(/^[A-Za-z\s]+$/).required().min(3).max(30).messages({
        'string.required': 'District is required',
        'string.base': 'District must be a string',
        'string.empty': 'District cannot be empty',
        'string.min': 'District must be at least 3 characters long',
        'string.max': 'District must be at most 30 characters long',
        'string.pattern.base': 'District can contain only letters',
    }),
    city: Joi.string().pattern(/^[A-Za-z\s]+$/).required().min(3).max(30).messages({
        'string.required': 'City is required',
        'string.base': 'City must be a string',
        'string.empty': 'City cannot be empty',
        'string.min': 'City must be at least 3 characters long',
        'string.max': 'City must be at most 30 characters long',
        'string.pattern.base': 'City can contain only letters',
    }),
    pincode: Joi.string().pattern(/^[1-9]{1}[0-9]{5}$/).required().messages({
        'string.empty': 'Pincode cannot be empty',
        'string.pattern.base': 'Pincode must be a valid 6-digit number.',
        'string.required': 'Pincode is required',
    }),

    nationality: Joi.string().pattern(/^[A-Za-z\s]+$/).required().min(3).max(30).messages({
        'string.required': 'Nationality is required',
        'string.base': 'Nationality must be a string',
        'string.empty': 'Nationality cannot be empty',
        'string.min': 'Nationality must be at least 3 characters long',
        'string.max': 'Nationality must be at most 50 characters long',
        'string.pattern.base': 'Nationality can contain only letters',
    }),
})