import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { register, login, logout, getMe } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.post(
    "/logout",
    authenticate,
    logout
);

authRouter.get(
    "/me",
    authenticate,
    getMe
);

export { authRouter };
