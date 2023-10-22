import {Router} from "express";
import { AuthController } from "../controllers/auth.controller";
import { loginValidator } from "../commom/validators/auth.validator";
import { validationErrors } from "../commom/validators/validation-errors";
import { googleRoutes } from "./google.auth.routes";
import { refreshTokenMiddleware } from "../middlewares/refreshToken.middleware";
import { userRoute } from "./user.routes";


export const routes = Router();


const authController = new AuthController();

routes.post("/login",loginValidator, validationErrors, authController.login);
routes.post("/refreshtoken", refreshTokenMiddleware, authController.refreshToken);
routes.post("/logout", authController.logout);

routes.use("/google", googleRoutes);
routes.use("/user", userRoute);
