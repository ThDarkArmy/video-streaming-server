import { Schema, model } from "mongoose"
import { hash, compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { randomBytes } from 'crypto'
import { SECRET, DEFAULT_PROFILE_IMAGE_PATH } from "../constants";
import { pick } from 'lodash'


const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        default: null
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin", "superadmin"]
    },
    profileImagePath:{
        type: String,
        default: DEFAULT_PROFILE_IMAGE_PATH
    },
    verified:{
        type: Boolean,
        default: false
    },
    verificationCode:{
        type: String,
        required: false,
        default: undefined
    },
    resetPassword: {
        type: String,
        required: false,
        default: undefined
    },
    resetPasswordToken:{
        type: String,
        required: false
    },
    resetPasswordTokenExpiresIn:{
        type: Date,
        required: false
    },
    channel: {
        type: Schema.Types.ObjectId,
        ref: "Channel"
    }

}, { timestamps: true})

UserSchema.pre('save', async function(next){
    let user = this
    if(!user.isModified('password')) return next()
    user.password = await hash(user.password, 10)
    next()
})

UserSchema.methods.comparePassword = async function(password){
    return await compare(password, this.password)
}

UserSchema.methods.generateJwt = async function(){
    console.log("SECRET", SECRET)
    let payload = {
        id: this._id,
        name: this.name,
        email: this.email,
        role: this.role,
    }

    return sign(payload, SECRET, {expiresIn: '1 day'})
}

UserSchema.methods.generatePasswordResetToken = function(){
    this.resetPasswordTokenExpiresIn = Date.now() + 36000000
    this.resetPasswordToken = randomBytes(20).toString('hex')
}

UserSchema.methods.getUserInfo = function(){
    return pick(this, ["_id", "name", "email", "role"])
}



export default model("User", UserSchema)


