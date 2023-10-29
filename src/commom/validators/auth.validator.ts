import { body } from "express-validator";

export const loginValidator = [
	body("login")
		.exists({ values: "falsy" }).withMessage("login é obrigatório")
		.isString().withMessage("login é inválido"),
	body("password")
		.exists({ checkFalsy: true }).withMessage("Senha é obrigatória")
		.isString().withMessage("Senha Inválida")
];