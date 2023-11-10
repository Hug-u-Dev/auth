import { PrismaClient, Validation_token } from "@prisma/client";
import { v4 } from "uuid";

const prisma = new PrismaClient();

export class ValidationTokenRepository {

	getAll = async(filter: Partial<Validation_token>) => {
		const token = await prisma.validation_token.findMany({
			where: filter
		});
		return token;
	};

	getUnique = async(fields: Partial<Validation_token>): Promise<Validation_token | null> => {
		const token = await prisma.validation_token.findUnique({
			where: fields
		});
		return token;
	};

	getFirst = async(fields: Partial<Validation_token>): Promise<Validation_token | null> => {
		const token = await prisma.validation_token.findMany({
			orderBy: [{createdAt: "desc"}],
			where: fields
		});
		return token[0];
	};
    
	register = async(fields: Omit<Validation_token, "id">) => {
		const {token, channel, receiver, expiresAt, createdAt, valid } = fields;
		const newToken = await prisma.validation_token.create({
			data: {
				id: v4(),
				channel,
				token,
				receiver,
				valid,
				expiresAt, 
				createdAt
			}});
		return newToken;
	};

	update = async(id:string, fields: Partial<Validation_token>) => {
		const deleted = await prisma.validation_token.update({
			where: {id},
			data: fields
		});
		return deleted;
	};

}

