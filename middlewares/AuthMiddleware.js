import passport from 'passport';
import { ExtractJwt, Strategy} from 'passport-jwt';
import User from '../models/User';
import createError from 'http-errors'
import JWT from 'jsonwebtoken'
import fs from 'fs'


const PUB_KEY = fs.readFileSync("\D:\\Node Js\\VideoStreamingServer\\crypto\\id_rsa_pub.pem", 'utf8')

const options = {
    secretOrKey: "secret",
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    algorithms: ['RS256']
}

passport.use(new Strategy(options, async ({id}, done)=>{
    try{
        let user = await User.findById(id)
        if(!user) throw createError.NOTFOUND("User not found.")
        return done(null, user.getUserInfo())

    }catch (error){
        done(error, false)
    }
}))

export const Authenticate = passport.authenticate('jwt', {"session": false});


export const AuthenticateUser = (req, res, next)=>{
    const authHeader = req.headers["authorization"]
    if(!authHeader) return next(createError.Unauthorized("No authorization token"))

    const token = authHeader.split(' ')[1]
    JWT.verify(token, PUB_KEY, {algorithms: ['RS256']},(err, payload)=>{
        if(err){
            if(err.name === "jsonWebTokenError"){
                return next(createError.Unauthorized())
            }else{
                return next(createError.Unauthorized(err.message))
            }
        }

        req.user = payload
        next()
    })
}


const matchRoles = (roles, userRoles)=>{
    for(const role of userRoles){
        if(roles.includes(role))
            return true
    }

    return false
}


export const assertRole = roles => (req, res, next)=>{
    if(matchRoles(roles, req.user.roles)){
        next()
    }else{
        return res.status(400).json({
            success: false,
            message: "Unauthorized | User does not have permission for this route.",
        })
    }
}


