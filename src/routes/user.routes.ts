import {Router} from "express";
import { UserController } from "../controllers/user.controller";
import { userValidator } from "../commom/validators/user.validator";
import { validationErrors } from "../commom/validators/validation-errors";

export const userRoute = Router();

const userController = new UserController();

userRoute.get("/", userController.getAll);
userRoute.get("/:id", userController.getById);
userRoute.post("/", userValidator, validationErrors, userController.register);
userRoute.put("/:id", userController.update);
userRoute.delete("/:id", userController.delete);



