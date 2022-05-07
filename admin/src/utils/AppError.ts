export class ServerError extends Error {
	constructor(httpStatusCode: number, message: string, caller: string) {
		super(message); // call the parent's constructor class; assign 'message' to the message param.

		// ServerError properties
		this.caller = caller;
		this.httpStatusCode = httpStatusCode;
		this.httpStatusMessage = `${httpStatusCode}`.startsWith(`4`) ? "fail" : "error";
		this.isOperational = true;

		// REMOVE > DOES NOT SEEM COMPATIBLE WITH TS
		// Error.captureStackTrace(this, this.constructor);
	}

	httpStatusCode!: number;
	caller!: string;
	httpStatusMessage!: string;
	isOperational?: boolean;
}

// SANDBOX
export default class AppError extends Error {
	isOperational: boolean;
	httpStatusMessage: string
	constructor(
		public httpStatusCode: number,
		public message: string,
		public caller: string,
	) {
		super(message);
		this.httpStatusMessage = `${httpStatusCode}`.startsWith(`4`) ? "fail" : "error";
		this.isOperational = true;

		// ????? don't know what this does
		Error.captureStackTrace(this);
	}
}
