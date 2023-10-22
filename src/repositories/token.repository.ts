import { PrismaClient, Token } from "@prisma/client";

const prisma = new PrismaClient();

export class TokenRepository {

	getAll = async(filter: Partial<Token>) => {
		const token = await prisma.token.findMany({
			where: filter
		});
		return token;
	};

	getUnique = async(fields: Partial<Token>): Promise<Token | null> => {
		const token = await prisma.token.findUnique({
			where: fields
		});
		return token;
	};
    
	register = async(fields: Token) => {
		const {token, userId, expiresAt } = fields;
		const newToken = await prisma.token.create({
			data: {
				userId,
				token,
				expiresAt
			}});
		return newToken;
	};

	delete = async(token:any) => {
		const deleted = await prisma.token.delete({
			where: token
		});
		return deleted;
	};

}

