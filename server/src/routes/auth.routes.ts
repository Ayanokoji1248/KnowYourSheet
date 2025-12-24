import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller";
const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post('/logout', logout);

export default authRouter;