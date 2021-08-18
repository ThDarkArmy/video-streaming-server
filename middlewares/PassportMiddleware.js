import passport from 'passport';
import { ExtractJwt, Strategy} from 'passport-jwt';
import { SECRET as secretOrKey} from '../constants';
import User from '../models/User';
import createError from 'http-errors'

const options = {
    secretOrKey,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    algorithms: ['RS256']
}

passport.use(new Strategy(options, async ({id}, done)=>{
    try{
        let user = await User.findById(id)
        if(!user) throw createError.NOTFOUND()
        return done(null, user.getUserInfo())

    }catch (error){
        done(null, false)
    }
}))

export const authenticateUser = passport.authenticate("jwt", {"session": false});


