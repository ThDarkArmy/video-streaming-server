import { Router } from "express"
import {AuthenticateUser} from "../middlewares/AuthMiddleware";
import { subscribeOrUnsubscribe, onOrOffNotification } from "../controllers/SubscriptionController";

const router = Router()

router.post("/subscribeOrUnsubscribe", AuthenticateUser, subscribeOrUnsubscribe)
router.post("/onOrOffNotification", AuthenticateUser, onOrOffNotification)


export default router