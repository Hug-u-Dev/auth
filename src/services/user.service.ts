import { User } from "@prisma/client";
import { UserRepository } from "../repositories/user.repository";
import { BadRequest, Conflict, Created, NotFound, OK, ResponseBody } from "../commom/responses/responses";

const userRepository = new UserRepository();

export class UserService {
	getAll = async(filter: Partial<User>): Promise<ResponseBody<User[]>> => {
		const user = await userRepository.getAll(filter);

		if (user.length == 0) return new NotFound("Nenhum usuário encontrado");
		return new OK(user) ;
	};

	getUnique = async(filter: Partial<User>): Promise<ResponseBody<User>> => {
		const user = await userRepository.getUnique(filter);

		if (!user) return new NotFound("Nenhum usuário encontrado");
		return new OK(user);
	};

	register = async(fields: Omit<User, "id">): Promise<ResponseBody<User>> => {
		const {userName, email} = fields;
		const isUserNameUnique = await userRepository.getUnique({userName});
		const isEmailUnique = await userRepository.getUnique({email});

		if (isEmailUnique || isUserNameUnique) {
			return new Conflict("Conflito! UserName e Email precisam ser únicos!");
		}

		const user = await userRepository.register(fields);
		if (!user) return new BadRequest("Não foi possível criar o usuário");
		return new Created(user);
        
	};

	update = async(id: string, fields: Omit<User, "id">): Promise<ResponseBody<User>> => {  
		const userExists = await userRepository.getUnique({id});
		if (!userExists) return new NotFound("usuário não encontrado");

		const user = await userRepository.update(id, fields);

		if (!user) return new BadRequest("Não foi possível modificar o usuário");
		return new OK(user);
	};

	delete = async(id: string): Promise<ResponseBody<User>> => {
		const userExists = await userRepository.getUnique({id});
		if (!userExists) return new NotFound("usuário não encontrado");
        
		const user = await userRepository.delete(id);
		if (!user) return new BadRequest("Não foi possível deletar o usuário");
		return new OK("usuário deletado");
	};
        
}