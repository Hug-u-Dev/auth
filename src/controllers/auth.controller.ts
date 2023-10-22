import {  ResponseBody, Token } from "../commom/responses/responses";
import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";

const authService = new AuthService();

export class AuthController {
	login = async(req: Request, res: Response) => {
		try {
			const fields = req.body;
			const login: ResponseBody<Token> = await authService.login(fields);
			return res.status(login.statusCode).json(login.response);
		}
		catch (e) {
			return res.status(500).json(e);
		}
	};

	refreshToken = async(req: Request, res: Response) => {
		try {
			const {refreshToken} = req.body;
			const token: ResponseBody<Token> = await authService.refreshToken(refreshToken);
			return res.status(token.statusCode).json(token.response);
		}
		catch (e) {
			return res.status(500).json(e);
		}
        
	};

	logout = async(req: Request, res: Response) => {
		try {
			const logout: ResponseBody<any> = await authService.logout();
			return res.status(logout.statusCode).json(logout.response);
		}
		catch (e) {
			return res.status(500).json(e);
		}
        
	};

}