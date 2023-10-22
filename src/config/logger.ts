import { createLogger, format, transports } from "winston";


// Create a logger instance
const logger = createLogger({
	level: "info",
	format: format.combine(
		format.colorize({ all: true }), // Add colors
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		format.printf(({ timestamp, level, message }) => {
			return `${timestamp} [${level}] ${message}`; // format message
		})
	),
	transports: [
		new transports.Console(), //print to console
		//new transports.File({ filename: "error.log", level: "warn" }), //save in file erro.log warn and above

	], 
});

export default logger;
