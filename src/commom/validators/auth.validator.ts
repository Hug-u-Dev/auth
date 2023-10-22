import { body } from "express-validator";

export const loginValidator = [
	body("userName")
		.exists({ values: "falsy" }).withMessage("UserName é obrigatório")
		.isString().withMessage("UserName é inválido"),
	body("password")
		.exists({ checkFalsy: true }).withMessage("Senha é obrigatória")
		.isString().withMessage("Senha Inválida")
];