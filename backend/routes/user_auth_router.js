import express from 'express'
import {createUser,loginUser} from '../controllers/user_auth_controller.js'
const authRouter = express.Router()
authRouter.post('/create/user',createUser);
authRouter.post('/login/user',loginUser);
export default authRouter;