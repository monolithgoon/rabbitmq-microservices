`use strict`;
import express, { Express, Request, Response, NextFunction, Application } from "express";
import cors from "cors";
// import * as helmet from "helmet"
// const mongoSanitize = require('express-mongo-sanitize');
// import * as mongoSanitize from "express-mongo-sanitize";
// const xss = require('xss-clean');
// import * as xss from "xss-clean";
// const compression = require("compression"); // server response compression
// import * as compression from "compression"
const globalErrorHandler = require("./controllers/error-controller.js");
// import globalErrorHandler from "./controllers/error-controller.ts";
import productsRouter from "./routes/product-routes";



// EXTEND THE GLOBAL INTERFACE
declare global {

	var __approotdir: any;

	// // CUSTOM REQUEST INTERFACE
	// namespace Express {
	// 	interface CustomRequest extends Request {
	// 		requestTime: string,
	// 	}
	// }
};


// REMOVE
// CUSTOM REQUEST INTERFACE
interface CustomRequest extends Request {
	requestTime: string,
}

// MODULE AUGMENTATION
declare module 'express-serve-static-core' {
	interface Request {
		requestTime: string,
	}
}


// APPEND THE APP BASE DIR. TO THE GLOBAL OBJ.
global.__approotdir = __dirname;


// INTST. EXPRESS
const ExpressApp : Express = express();


// * HEALTH CHECK ENDPOINTS
ExpressApp.get("/status", (req: Request, res: Response) => {
	res.status(200).end();
});
ExpressApp.head("/status", (req: Request, res: Response) => {
	res.status(200).end();
});


// GLOBAL 3RD PARTY M-WARE >

// SET SECURITY HTTP HEADERS
// ExpressApp.use(helmet());

// DATA SANITIZATION AGAINST MALICIOUS NoSQL QUERY-INJECTION
// removes '$' from req.body, req.params and/or req. query string
// prevents this attack => "email": {"$gt": ""}
// ExpressApp.use(mongoSanitize());

// DATA SANITIZATION AGAINST XSS
// filters out HTML tags & prevents malicious HTML from executing JS 
// ExpressApp.use(xss());

// SERVER RESPONSE COMPRESSION MIDDLEWARE FOR ALL TEXT SENT TO CLIENTS
// ExpressApp.use(compression());

// parse JSON data from the request body into req.body
ExpressApp.use(express.json());


// CUSTOM M-WARE > 

// REMOVE
// ADD A CUSTOM PROPERTY ('requestTime) TO THE REQUEST OBJ.
// ExpressApp.use((req: Request, next: NextFunction) => {

// 	req.requestTime = new Date().toISOString();

// 	console.log(req.headers);

// 	// return next();
// });


ExpressApp.use(
   cors({
      origin: ["http://localhost:3000", "http://localhost:8080", "http://localhost:3001"],
   })
);


// MOUNT THE ROUTES
ExpressApp.use("/", productsRouter);


// GLOBAL ERROR HANDLING M.WARE
ExpressApp.use(globalErrorHandler);


module.exports = ExpressApp;