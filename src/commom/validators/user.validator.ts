import { body } from "express-validator";

export const userValidator = [
	body("email")
		.exists({ values: "falsy" }).withMessage("Email é obrigatório")
		.isEmail().withMessage("Email inválido"),
	body("password")
		.exists({ checkFalsy: true }).withMessage("Senha é obrigatória")
		.isString().withMessage("Senha Inválida")
		.isStrongPassword().withMessage("Senha deve ter no mínimo 8 caracteres, 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caracter especial")
];