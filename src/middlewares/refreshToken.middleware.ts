import { Request, Response, NextFunction } from "express";
import { Unathorized } from "../commom/responses/responses";
import  Jwt  from "jsonwebtoken";
import { refreshSecret } from "../config/token.config";


export function refreshTokenMiddleware(req: Request, res: Response, next: NextFunction) {
	const {refreshToken} = req.body;
	try {
		if (!refreshToken) {
			throw new Unathorized("Nenhum token foi passado");
		}

		Jwt.verify(refreshToken, refreshSecret, (err: any, decoded: any) => {
			if (err) throw new Unathorized(`refresh token expired::${err}`);
			if (decoded) {
				next();
			} else {
				throw new Unathorized("Token inválido ou expirado");
			}
		});
	} catch (err: any) {
		return res.status(401).json({ Error: err });
	}
}







