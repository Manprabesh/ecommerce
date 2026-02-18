import express from 'express'
import { createUser, loginUser } from '../controllers/user_auth_controller.js'
import isAuthenticated from "../middleware/isAuthenticated.js"
const authRouter = express.Router()
authRouter.post('/create/user', createUser);
authRouter.post('/login/user', loginUser);
authRouter.get('/isAuthenticated', isAuthenticated, (req, res) => {
    res.status(200).json({
        authenticated: true,
        user: req.user
    });
});
export default authRouter;