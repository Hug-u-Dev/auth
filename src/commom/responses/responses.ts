export interface ResponseBody<T> {
    statusCode: number,
    response: T | string,
}

export interface Token{
    token: string
}

export class OK<T> implements ResponseBody<T> {
	statusCode = 200;
	response: T | string = "Success!";

	constructor(msg?: T) {
		if (msg) this.response = msg;
	}
}

export class Created<T> implements ResponseBody<T> {
	statusCode = 201;
	response: T | string = "Created with success!";

	constructor(msg?: T) {
		if (msg) this.response = msg;
	}
}

export class Unathorized<T> implements ResponseBody<T> {
	statusCode = 401;
	response: T | string = "Unathorized";

	constructor(msg?: T) {
		if (msg) this.response = msg;
	}
}
export class NotFound<T> implements ResponseBody<T> {
	statusCode = 404;
	response: T | string = "Not found";

	constructor(msg?: T) {
		if (msg) this.response = msg;
	}
}

export class Conflict implements ResponseBody<string> {
	statusCode = 409;
	response = "there is a conflict with our DB";

	constructor(msg?: string) {
		if (msg) this.response = msg;
	}
}

export class Forbidden implements ResponseBody<string> {
	statusCode = 403;
	response= "You don't have authorization";

	constructor(msg?: string) {
		if (msg) this.response = msg;
	}
}
export class BadRequest<T> implements ResponseBody<T> {
	statusCode = 400;
	response: T | string = "there was a problem with the request";

	constructor(msg?: T) {
		if (msg) this.response = msg;
	}
}

export class InternalServerError<T> implements ResponseBody<T> {
	statusCode = 500;
	response = "Internal Server Error";

	constructor(msg?: string) {
		if (msg) this.response = msg;
	}
}