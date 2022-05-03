class ServerError extends Error {
	constructor(message: string, statusCode: Number, caller: string) {
		super(message); // call the parent's constructor class; assign 'message' to the message param.

		// ServerError properties
		this.caller = caller;
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith(`4`) ? "fail" : "error";
		this.isOperational = true;

		// REMOVE > DOES NOT SEEM COMPATIBLE WITH TS
		// Error.captureStackTrace(this, this.constructor);
	}

   statusCode!: Number;
   caller!: string;
   status!: string;
   isOperational?: Boolean;
}

export default ServerError;
