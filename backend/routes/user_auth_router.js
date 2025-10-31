import express from 'express'
import user_signup from '../controllers/user_auth_controller.js'
const authRouter = express.Router()
authRouter.post('/signup',user_signup);
export default authRouter;