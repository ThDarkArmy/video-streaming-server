import { check } from 'express-validator';

const fullName = check("fullName", "Full name is required.").not().isEmpty()
const email = check("email", "Please enter valid email.").isEmail()
const password = check("password", "Password must be of minimum length 6").isLength({min:6})
const mobile = check("mobile", "Please provide valid mobile number").isNumeric().isLength(6)

export const registerValidation = [fullName, email, password]
export const loginValidation = [email, password]
