import { validationResult } from "express-validator";

const ValidationMiddleware = (req, res, next)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: errors.array()
        })
    }
    next()
}

export default ValidationMiddleware;