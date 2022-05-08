import { Request, Response, NextFunction } from "express";
import cm from "./chalk-messages";

// THIS MODULE REPLACES THE try / catch BLOCK IN AN REQ/RES ASYNC FUNCTION
export default function catchAppAsync(fn: Function, fnDescr?: string) {
	if (fnDescr) fnDescr = fnDescr;
	if (fnDescr === undefined && fn.name) fnDescr = fn.name;
	if (fnDescr === undefined && fn.name === undefined) fnDescr = "undef. caller";

	return function (req: Request, res: Response, next: NextFunction) {
		
		fn(req, res, next).catch((asyncErr: Error) => {
			
			console.error(cm.fail(`${fnDescr}: ${asyncErr.message}`));

			// PASS TO GLOBAL ERR. HANDLER
			next(asyncErr);
		});

		// fn(req, res, next).catch(next); // SAME AS ABOVE
	};
}
