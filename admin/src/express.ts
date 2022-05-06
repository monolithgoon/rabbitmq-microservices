import express, { Express, Request, Response, NextFunction, Application } from "express";
import client, { Connection as amqpConnection, ConsumeMessage, Channel } from "amqplib";
import { Repository, Connection as typeormConnection } from "typeorm";
import cors from "cors";
// import * as helmet from "helmet"
// const mongoSanitize = require('express-mongo-sanitize');
// import * as mongoSanitize from "express-mongo-sanitize";
// const xss = require('xss-clean');
// import * as xss from "xss-clean";
// const compression = require("compression"); // server response compression
// import * as compression from "compression"
// const globalErrorHandler = require("./controllers/error-controller.js");
import { DBConnect } from "./services/db-connect";
import Product from "./entity/product";
import productRouter from "./routes/product-routes";
import productRouter2 from "./routes/product-routes-2";
import productRouter3 from "./routes/product-routes-3";
import DatabaseConnection from "./services/DatabaseConnection";
import catchServerAsync from "./utils/catch-server-async";
import cm from "./utils/chalk-messages";
import catchError, { catchAsyncError } from "./utils/catch-error";

// EXTEND THE GLOBAL INTERFACE
declare global {
	var __approotdir: any;

	// REMOVE
	// CUSTOM REQUEST INTERFACE
	// namespace Express {
	// 	interface CustomRequest extends Request {
	// 		requestTime: string,
	// 	}
	// }
}

// REMOVE
// CUSTOM REQUEST INTERFACE
interface CustomRequest extends Request {
	requestTime: string;
}

// CUSTOM REQUEST INTERFACE VIA MODULE AUGMENTATION
declare module "express-serve-static-core" {
	interface Request {
		requestTime: string;
		ormConnection: typeormConnection;
		productRepository: Repository<Product>;
		amqpChannel: Channel;
	}
}

// APPEND THE APP BASE DIR. TO THE GLOBAL OBJ.
global.__approotdir = __dirname;

// INTST. EXPRESS
const ExpressApp: Express = express();

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


ExpressApp.use(
	cors({
		origin: ["http://localhost:3000", "http://localhost:8080", "http://localhost:3001"],
	})
);


// CUSTOM M-WARE >('requestTime) TO THE REQUEST OBJ.
ExpressApp.use((req: Request, res: Response, next: NextFunction): void => {
	req.requestTime = new Date().toISOString();

	const reqHeaders = req.headers;
	console.log({ reqHeaders });

	next();
});


// 1. ESTABLISH TYPE ORM & AMQP CONNECTIONS
// 2. APPEND ORM REPOS AND AMQP CHANNEL TO REQUEST OBJ
// 3. MOUNT THE ROUTERS
(function () {
	let ormConnection: typeormConnection;
	let msgQueueConnection: amqpConnection;
	let amqpChannel: Channel;


	// connect to typeorm db
	(async () => {
		ormConnection = await new DatabaseConnection().returnConnection("default");
		// console.log({ormConnection}
	})();


	//
	const appendOrmConnect = (req: Request, res: Response, next: NextFunction) => {
		req.ormConnection = ormConnection;
		next();
	};


	// APPEND ORM REPOS. TO REQ. OBJ.
	const getOrmRepos = catchError(function getOrmRepos(req: Request, res: Response, next: NextFunction) {
		const productRepository = req.ormConnection.getRepository(Product);
		// console.log({productRepository})

		req.productRepository = productRepository;

		next();
	});


	// EST. AMQP CONNECTION
	catchAsyncError(async function amqpConnect() {

		console.log(cm.working(`Connecting to AMQP server ..`));

		const amqpUrl = `amqp://fhzyldga:0DNCJI95lxdyn2rfdQybKP8bz-g30LgA@hawk.rmq.cloudamqp.com/fhzyldga`;

		msgQueueConnection = await client.connect(amqpUrl);
		console.log({ msgQueueConnection });

		amqpChannel = await msgQueueConnection.createChannel();
		console.log({ amqpChannel });
	})();

	// SEND "amqpChannel" TO ROUTES VIA CUSTOM REQ. PROPS
	const appendAmqpChannel = async function appendAmqpChannel (req: Request, res: Response, next: NextFunction) {
			req.amqpChannel = amqpChannel;
			next();
		};

	// MOUNT THE ROUTERS
	ExpressApp.use("/api/products", appendOrmConnect, getOrmRepos, appendAmqpChannel, productRouter);
})();


// MOUNT THE ROUTES
// ExpressApp.use("/api/products/module-conn-db", productRouter2);
// ExpressApp.use("/api/products/fn-conn-db", productRouter3);


// GLOBAL ERROR HANDLING M.WARE
// ExpressApp.use(globalErrorHandler);


export default ExpressApp;
