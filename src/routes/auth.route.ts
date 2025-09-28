import { Router } from "express";
import validate from "../middlewares/validateSchema.ts";
import { registerSchema, refreshSchema } from "../validation/auth.schema.ts";
import {
    register,
    login,
    refresh,
    logout,
} from "../controllers/auth.controller.ts";

const authRouter: Router = Router();

authRouter.post("/register", validate(registerSchema, "body"), register);
authRouter.post("/login", validate(registerSchema, "body"), login);
authRouter.post("/refresh", validate(refreshSchema, "cookies"), refresh);
authRouter.post("/logout", validate(refreshSchema, "cookies"), logout);

export default authRouter;
