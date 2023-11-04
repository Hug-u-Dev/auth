import { createLogger, format, transports } from "winston";



class Log {
	// Create a logger instance
	private logger = createLogger({
		level: "info",
		format: format.combine(
			format.colorize({ all: true }), // Add colors
			format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
			format.printf(({ timestamp, level, message}) => {
				return `${timestamp} [${level}] ${message}`; // format message
			})
		),
		transports: [
			new transports.Console(), //print to console
			//new transports.File({ filename: "error.log", level: "warn" }), //save in file erro.log warn and above

		],
	});

	info = (msg: string, obj?: any) => {
		const message = obj? `${msg} - ${JSON.stringify(obj)}`: msg;
		this.logger.info(message);
	};

	error = (msg: string, obj?: any) => {
		const message = obj? `${msg} - ${JSON.stringify(obj)}`: msg;
		this.logger.error(message);
	};

	warn = (msg: string, obj?: any) => {
		const message = obj? `${msg} - ${JSON.stringify(obj)}`: msg;
		this.logger.warn(message);
	};
}

export default new Log();