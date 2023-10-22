import { User } from "@prisma/client";
import { ResponseBody } from "../commom/responses/responses";
import { UserService } from "../services/user.service";
import { Request, Response } from "express";

const userService = new UserService();

export class UserController {
	getAll = async(req: Request, res: Response) => {
		try {
			const filter = req.query;
			const user: ResponseBody<User[]> = await userService.getAll(filter);
            
			return res.status(user.statusCode).json(user.response);
		}
		catch (e) {
			return res.status(500).json(e);
		}
	};

	getById = async(req: Request, res: Response) => {
		try {
          
			const {id} = req.params;
			const user: ResponseBody<User> = await userService.getUnique({id});

			return res.status(user.statusCode).json(user.response);
		}
		catch (e) {
			return res.status(500).json(e);
		}
        
	};

	register = async(req: Request, res: Response) => {
		try {
			const fields: Omit<User, "id"> = req.body;
			if (!fields.login) {
				fields.login = fields.email+"_pwd";
			}
			const user: ResponseBody<User> = await userService.register(fields);
			return res.status(user.statusCode).json(user.response);
		}
		catch (e) {
			return res.status(500).json(e);
		}
        
	};

	update = async(req: Request, res: Response) => {
		try {
			const {id} = req.params;
			const fields = req.body;
			const user: ResponseBody<User> = await userService.update(id, fields);

			return res.status(user.statusCode).json(user.response);
		}
		catch (e) {
			return res.status(500).json(e);
		}
        
	};

	delete = async(req: Request, res: Response) => {
		try {
			const {id} = req.params;
			const user: ResponseBody<User> = await userService.delete(id);

			return res.status(user.statusCode).json(user.response);
		}
		catch (e) {
			return res.status(500).json(e);
		}
        
	};
}