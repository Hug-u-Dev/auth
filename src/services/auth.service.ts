import { UserRepository } from "../repositories/user.repository";
import { Ilogin } from "../models/login.models";
import { BadRequest, NotFound, OK,  ResponseBody, Unathorized } from "../commom/responses/responses";
import { Profile } from "passport-google-oauth20";
import { UserService } from "./user.service";
import Jwt from "jsonwebtoken";
import { TokenRepository } from "../repositories/token.repository";
import { accesSecret, accessTokenExpiration, refreshSecret, refreshTokenExpiration, validationTokenExpiration } from "../config/token.config";
import {Channel, Role} from "@prisma/client";
import bcrypt from "bcrypt";
import { ValidationTokenRepository } from "../repositories/validation-token.repository";
import axios from "axios";

const userRepository = new UserRepository();
const userService = new UserService();
const tokenRepository = new TokenRepository();
const validationTokenRepository = new ValidationTokenRepository();

const NOTIFICATION_URL = process.env.NOTIFICAION_URL ||"http://localhost:3005/mail";
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
	};

	logout = async(): Promise<ResponseBody<any>> => {
		return new OK();
	};
       
	
	google = async(profile: Profile): Promise<ResponseBody<any>> =>  {
    
	
		const email= profile._json.email;
		if (!email) {
			return  new BadRequest("Nenhum email associado a essa conta google");
		}
		const isRegistered = await userRepository.getUnique({email});
		const password = profile.id;

		if (!isRegistered) {
			await userService.register({
				login: email,
				name: profile.displayName,
				email,
				role: Role.USER,
				password,
				createdAt: new Date(),
				updatedAt: new Date()
			});
    
		}
		const user = await userRepository.getUnique({email});
	
		if (user) {
			const accessToken = await this.issueAccessToken({login: user?.login, userID: user?.id, role: user?.role });
			const refreshToken = await this.issueRefreshToken({login: user?.login}, user.id);
			return new OK({accessToken, refreshToken});
		} else {
			return  new BadRequest("Não foi possível logar");
		}  
	};

	refreshToken = async(token:string): Promise<ResponseBody<any>> => {

		const tokenDB = await tokenRepository.getUnique({token});
		if (!tokenDB) return new Unathorized("Refresh token não encontrado no DB");

		await tokenRepository.delete({token});
       
		//TODO: TEM QUE COMPARAR O USERiD DO TOKEN COM ALGUM APSSADO PELO APP
		const user = await userRepository.getUnique({id: tokenDB.userId});
		if (!user) return new Unathorized("Nenhum usuário associado ao token");
       
		const accessToken = await this.issueAccessToken({login: user?.login, userID: user?.id });
		const refreshToken = await this.issueRefreshToken({login: user?.login}, user?.id);
       
		return new OK({accessToken, refreshToken});
	};

	sendToken = async(mail:string): Promise<ResponseBody<any>> => {

		const user = await userRepository.getUnique({email: mail});
		if (!user) return new NotFound("Nenhum usuário associado ao email");

		const token = await this.generateRandomNumber();
		const createdAt = new Date();
		const expiresAt = new Date();
		expiresAt.setSeconds(expiresAt.getSeconds() + Number(validationTokenExpiration)); 

		const  res = await validationTokenRepository.register({channel: Channel.EMAIL,  token, receiver: mail, createdAt, valid: true, expiresAt})

		if (!res) return new BadRequest("Não foi possível criar o token");
		await axios.post(NOTIFICATION_URL, 
			{
				emailTo: mail,
				token: `${token}`
			}
		);
		return new OK(res);
	
	};

	validateToken = async(mail:string, token: string): Promise<ResponseBody<any>> => {

		const user = await userRepository.getUnique({email: mail});
		if (!user) return new NotFound("Nenhum usuário associado ao email");

		const validationToken = await validationTokenRepository.getFirst({receiver: mail});

		if (validationToken?.token == Number(token) && validationToken.valid == true && validationToken.expiresAt > new Date()) {
			await validationTokenRepository.update(validationToken.id, {valid: false});
			return new OK({isValid: true});
		} else {
			return new OK({isValid: false});
		}
	
	};

	updatePassword = async(email:string, token: string, password: string): Promise<ResponseBody<any>> => {

		const user = await userRepository.getUnique({email});
		if (!user) return new NotFound("Nenhum usuário associado ao email");

		const validationToken = await validationTokenRepository.getFirst({receiver: email});

		if (validationToken?.token == Number(token) && validationToken.valid == false) {
			await userService.update(user.id, {password});
			return new OK();
		} else {
			return new BadRequest("there was a problem validating the token");
		}
	
	};
	

	private generateRandomNumber = async(): Promise<any> => {
		const min = 1000;
		const max = 9999;
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};


}