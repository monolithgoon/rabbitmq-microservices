import cm from "./chalk-messages";

const catchError = (fn: Function, fnDescr?: string | undefined) => {

	fnDescr = fnDescr
		? (fnDescr = fnDescr)
		: fn.name
		? (fnDescr = fn.name)
		: (fnDescr = "undef. caller");

	return function (...params: any) {
		try {
			return fn(...params);
		} catch (error: any) {
			// console.log(error.stack)
			console.log(cm.fail(`${fnDescr}: ${error.message}`));
		}
	};
};

export function catchAsyncError(fn: Function, fnDescr?: string | undefined) {

	fnDescr = fnDescr
		? (fnDescr = fnDescr)
		: fn.name
		? (fnDescr = fn.name)
		: (fnDescr = "undef. caller");

	return async function (...params: any) {
		try {
			return await fn(...params);
		} catch (error: any) {
			// console.log(error.stack)
			console.log(cm.fail(`${fnDescr}: ${error.message}`));

         // TODO > HOW TO CALL THE FAILING FN. REPEATEDLY UNTIL SUCCESS? 
         // catchAsyncError(await fn(...params));
		};
	};
}

export default catchError;
