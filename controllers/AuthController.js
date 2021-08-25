import User from '../models/User'
import createError from 'http-errors'
import { randomBytes } from 'crypto'
import MailSender from "../utils/MailSender";
import { BASE_URL} from "../constants";


// register user
export const register = async (req, res, next) => {
    try{
        const { name, email, password } = req.body;
        let user = await User.findOne({email:email})

        if(user) throw createError.BadRequest("Email already exists")

        user = new User({
            name,
            email,
            password,
            verificationCode: randomBytes(20).toString('hex')
        })

        await user.save();

        // sending mail to verify the account
        let verificationUrl = BASE_URL+"/auth/verify/"+user.verificationCode;
        let html = `<div><h2>Please click on the Verify Email to verify your email.</h2></br>` +
            `<a href=${verificationUrl}>Verify Email</a> </div>`
        const mailSender = new MailSender(user.email, "Account Verification", html)
        await mailSender.sendMail();

        res.status(201).json({
            success: true,
            message: "Account successfully created, please check your mail to verify your account."
        })

    }catch (err) {
        next(err)
    }
}

// verify email or account
export const verifyAccount = async (req, res, next)=>{
    try{
        let user = await User.findOne({verificationCode: req.params.verificationCode})
        console.log("in auth verification")

        if(!user) throw createError.BadRequest("Invalid verification code, user not found.")

        user.verified = true;
        user.verificationCode = undefined;

        await user.save()

        res.status(200).json({
            success: true,
            message: "Email verified, now you can login"
        })


    }catch(error){
        next(error)
    }
}


// login user
export const login = async (req, res, next) => {
    try{
        const { email, password } = req.body;
        const user = await User.findOne({email: email})

        if(!user) throw createError.NOTFOUND("User with given email does not exists.")

        if(!(await user.comparePassword(password))) throw createError.BadRequest("Incorrect password")

        let token = await user.generateJwt()

        res.status(200).json({
            success: true,
            message: "User successfully logged in",
            token: `Bearer ${token}`,
            user: user.getUserInfo(),
        })


    }catch (err) {
        next(err)
    }
}

// forgot password
export const forgotPassword = async (req, res, next)=>{
    try{
        const user = await User.findOne({email: req.body.email})
        if(!user) throw createError(404,"User with given mail doesn't exist")

        res.status(200).json({
            success: true,
            message: "User found, go ahead to reset the password",
            email: user.email
        })
    }catch(error){
        next(error)
    }
}

// reset password
export const resetPassword = async (req, res, next)=>{
    try{
        let user = await User.findOne({email: req.body.email})
        if(!user) throw createError.NotFound("User with given mail doesn't exist")

        user.resetPassword = req.body.password
        user.resetPasswordToken = randomBytes(20).toString('hex')
        user.resetPasswordTokenExpiresIn = new Date().setMinutes(new Date().getMinutes()+10)

        console.log(user.resetPasswordTokenExpiresIn)

        await user.save()

        // sending mail to verify reset password
        let verificationUrl = BASE_URL+"/auth/verifyResetPassword/"+user.resetPasswordToken;
        let html = `<div><h2>Please click on the Verify Email to verify reset password.</h2></br>` +
            `<a href=${verificationUrl}>Verify Password Reset</a> </div>`
        const mailSender = new MailSender(user.email, "Password Reset Verification", html)
        await mailSender.sendMail();

        res.status(200).json({
            success: true,
            message: "Please check the email to confirm password reset."
        })
    }catch (error) {
        next(error)
    }
}

// verify reset password
export const verifyPasswordReset = async (req, res, next) =>{
    try{
        let user = await User.findOne({resetPasswordToken: req.params.verificationCode})
        if(!user) throw createError.NotFound("Invalid verification token")

        if(user.resetPasswordTokenExpiresIn<new Date()) throw createError.BadRequest("Reset password token expired, please retry.")

        user.password = user.resetPassword
        user.resetPasswordToken = undefined
        user.resetPassword = undefined
        user.resetPasswordTokenExpiresIn=undefined

        user.save()

        res.status(200).json({
            success: true,
            message: "Password has been changed, now you can login with your new password",
        })

    }catch(error){
        next(error)
    }
}


