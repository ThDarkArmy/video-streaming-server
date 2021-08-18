import { Router } from 'express';
import validator from "../middlewares/ValidatorMiddleware";
import { registerValidation, loginValidation } from "../validators/UserValidators";
import { register, login, verifyAccount, forgotPassword, resetPassword, verifyPasswordReset } from "../controllers/AuthController";

const router = Router()

router.post("/register", registerValidation, validator, register);
router.post("/login", loginValidation, validator, login);
router.get("/verify/:verificationCode",verifyAccount);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);
router.get("/verifyResetPassword/:verificationCode", verifyPasswordReset);



export default router;