import { Request, Response, NextFunction } from "express";
import cm from "./chalk-messages";
import ServerError from "./server-error";

// THIS MODULE REPLACES THE try / catch BLOCK IN AN REQ/RES ASYNC FUNCTION
export default function catchServerAsync(fn: Function, fnDescr?: string | undefined) {

	fnDescr = fnDescr
	? (fnDescr = fnDescr)
	: fn.name
	? (fnDescr = fn.name)
	: (fnDescr = "undef. caller");

	return function (req: Request, res: Response, next: NextFunction) {

		fn(req, res, next).catch((asyncErr: unknown) => {

			if (asyncErr instanceof ServerError) {

				asyncErr.statusCode = 400;
				asyncErr.caller = fnDescr || `undef. caller`;

				res.status(400).json({status: "fail", statusCode: asyncErr.statusCode, message:asyncErr.message});
				// next(asyncErr); // TODO > USE next(error) WHEN YOU IMPLEMENT GLOBAL ERR. HANDLER IN express.ts

			} else if (asyncErr instanceof Error) {

				console.error(cm.fail(`${fnDescr}: ${asyncErr.message}`));

				// next(asyncErr); // TODO > USE next(error) WHEN YOU IMPLEMENT GLOBAL ERR. HANDLER IN express.ts
				res.status(400).json({status: "fail", message:asyncErr.message});
			}
		});

		// fn(req, res, next).catch(next); // SAME AS ABOVE
	};
}
