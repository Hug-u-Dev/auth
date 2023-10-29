import { UserRepository } from "../repositories/user.repository";
import { Ilogin } from "../models/login.models";
import { BadRequest, OK,  ResponseBody, Unathorized } from "../commom/responses/responses";
import { Profile } from "passport-google-oauth20";
import { UserService } from "./user.service";
import Jwt from "jsonwebtoken";
import { TokenRepository } from "../repositories/token.repository";
import { accesSecret, accessTokenExpiration, refreshSecret, refreshTokenExpiration } from "../config/token.config";
import {Role} from "@prisma/client";
import bcrypt from "bcrypt";

const userRepository = new UserRepository();
const userService = new UserService();
const tokenRepository = new TokenRepository();


export class AuthService {

	issueAccessToken = async(payload: any) => {
		const token = Jwt.sign(payload, accesSecret, {
			audience: "urn:jwt:type:access",
			issuer: "urn:system:token-issuer:type:access",
			expiresIn: `${accessTokenExpiration}s`
		});
		return token;
	};
    
	issueRefreshToken = async(payload: any, userId: string) => {
		const token =  Jwt.sign(payload, refreshSecret, {
			audience: "urn:jwt:type:refresh",
			issuer: "urn:system:token-issuer:type:refresh",
			expiresIn: `${refreshTokenExpiration}s`
		});
		const expirationDate = new Date(); 
		expirationDate.setSeconds(expirationDate.getSeconds() + Number(refreshTokenExpiration)); 
		await tokenRepository.register({userId, token, expiresAt:  expirationDate});
		return token;
	};
    
	login = async(fields: Ilogin): Promise<ResponseBody<any>> => {

		const {login, password } = fields;
		const user = await userRepository.getUnique({login});
		if (!user) {
			return  new BadRequest("Não foi possível logar");
		}

		const comparePwd = await bcrypt.compare(password, user.password);
		if (comparePwd) {
			const accessToken = await this.issueAccessToken({login: user?.login, userID: user?.id, role: user?.role });
			const refreshToken = await this.issueRefreshToken({login: user?.login}, user.id);
			return new OK({accessToken, refreshToken});
		}

		return  new BadRequest("Não foi possível logar");
	}

	logout = async(): Promise<ResponseBody<any>> => {
		return new OK();
	};
       
    
	google = async(profile: Profile): Promise<boolean> =>  {
    
		const login = profile.id + "_" + profile.provider;
		const isRegistered = await userRepository.getUnique({login});

		if (!isRegistered) {
			await userService.register({
				login: login,
				email: profile._json.email?? "need_register@email.com",
				role: Role.USER,
				password: profile.id,
				createdAt: new Date(),
				updatedAt: new Date()
			});
    
		}
		return !!isRegistered;
	};

	refreshToken = async(token:string): Promise<ResponseBody<any>> => {

		const tokenDB = await tokenRepository.getUnique({token});
		if (!tokenDB) return new Unathorized("Refresh token não encontrado no DB");

		await tokenRepository.delete({token});
       
		const user = await userRepository.getUnique({id: tokenDB.userId});
		if (!user) return new Unathorized("Nenhum usuário associado ao token");
       
		const accessToken = await this.issueAccessToken({login: user?.login, userID: user?.id });
		const refreshToken = await this.issueRefreshToken({login: user?.login}, user?.id);
       
		return new OK({accessToken, refreshToken});
	};


}