import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import AppError from "../utils/AppError";
import cm from "../utils/chalk-messages";
import HttpException from "../utils/HttpException";

const handleCastErrorDB = (err: Error) => {
	const message = `Invalid ${err.path}: ${err.value}`;
   return new AppError(400, message, "deeznuts")
};

const sendErrorDev = (err: unknown, req: Request, res: Response) => {};

const sendErrorProd = (err: Error, req: Request, res: Response) => {

   // handle /api errors
	if (req.originalUrl.startsWith("/api")) {

		// Operational, trusted error: send message to client
		if (err.isOperational) {

			if (err instanceof HttpException) {
				return res.status(err.httpStatusCode).json({
					statusMessage: err.httpStatusMessage,
					message: err.message,
				});
			};

		} else {

			// 1) Log error
			console.error("ERROR 🥺", err);

			// 2) Send error message
			return res.status(500).json({
				status: "error",
				message: "Something went wrong!",
			});
		}
	}
};

const globalErrorHandler: ErrorRequestHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (process.env.NODE_ENV === "development") {
      console.log(cm.result("FUCK YOU RITA"))
		sendErrorDev(err, req, res);
	}
	if (process.env.NODE_ENV === "production") {

		if (err instanceof Error) {

			// copy error
			let prodError = { ...err };

			prodError.message = err.message;

			//
			switch (prodError.name) {
				case "CastError":
					prodError = handleCastErrorDB(prodError);
					// break;

				default:
					prodError = prodError;
					// break;
			}

			// FIXME > CANNOT CREATE GLOBAL TYPE FOR "code" IN express.ts
			// switch (prodError.code) {
			// 	case 11000:
			// 		prodError = handleCastErrorDB(prodError);
			// 		// break;

			// 	default:
			// 		prodError = prodError;
			// 		// break;
			// }

			sendErrorProd(prodError, req, res);
		}
	}
};

export default globalErrorHandler;
