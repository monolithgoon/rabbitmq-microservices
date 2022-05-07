export default class HttpException extends Error {
	isOperational: boolean;
	constructor(
		public httpStatusCode: number,
		public httpStatusMessage: string,
		public message: string
	) {
		super(message);
		this.httpStatusMessage = `${httpStatusCode}`.startsWith(`4`) ? "fail" : "error";
		this.isOperational = true;

		// ????? don't know what this does
		Error.captureStackTrace(this);
	}
}
