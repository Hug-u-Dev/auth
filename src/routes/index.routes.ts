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

//CHANGE PASSWORD
routes.post("/send/:mail/token", authController.sendToken);
routes.post("/validate/:mail/token/:token", authController.validateToken);
routes.patch("/password/update", authController.passwordUpdate);

routes.use("/google", googleRoutes);
routes.use("/user", userRoute);
