import express, { Express, Request, Response, NextFunction, Application } from "express";
import client, { Connection as amqpConnection, Channel } from "amqplib";
import { Repository, Connection as typeormConnection } from "typeorm";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import DatabaseConnection from "./services/DatabaseConnection";
import Product from "./entity/product";
import productRouter from "./routes/product-routes";
// import productRouter2 from "./routes/product-routes-2";
// import productRouter3 from "./routes/product-routes-3";
import globalErrorHandler from "./controllers/global-error-handler";
import catchError, { catchAsyncError } from "./utils/catch-error";
import cm from "./utils/chalk-messages";
import appConfig from "./config/config";

// EXTEND THE GLOBAL INTERFACE
declare global {
	var __approotdir: string;

	// REMOVE
	// EXTEND REQUEST INTERFACE
	// namespace Express {
	// 	interface CustomRequest extends Request {
	// 		requestTime: string,
	// 	}
	// }

	// EXTEND DEFAULT ERROR TYPES
	interface Error {
		// code?: number
		path?: string;
		value?: string;
		isOperational?: boolean;
	}
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
ExpressApp.use(helmet());

// SERVER RESPONSE COMPRESSION MIDDLEWARE FOR ALL TEXT SENT TO CLIENTS
ExpressApp.use(compression());

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

	// append ormConnection to req. obj.
	const appendOrmConnect = (req: Request, res: Response, next: NextFunction) => {
		req.ormConnection = ormConnection;
		next();
	};

	// APPEND ORM REPOS. TO REQ. OBJ.
	const getOrmRepos = catchError(function getOrmRepos(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		const productRepository = req.ormConnection.getRepository(Product);
		// console.log({productRepository})

		req.productRepository = productRepository;

		next();
	});

	// EST. AMQP CONNECTION
	catchAsyncError(async function amqpConnect() {
		console.log(cm.working(`Connecting to AMQP server ..`));

		if (appConfig.amqpUrl) {
			msgQueueConnection = await client.connect(appConfig.amqpUrl);
			console.log({ msgQueueConnection });
		} else {
			// TODO >> ADD FAILED CONN. / RE-CONN LOGIC HERE
		}

		amqpChannel = await msgQueueConnection.createChannel();
		console.log({ amqpChannel });
	})();

	// SEND "amqpChannel" TO ROUTES VIA CUSTOM REQ. PROPS
	const appendAmqpChannel = async function appendAmqpChannel(
		req: Request,
		res: Response,
		next: NextFunction
	) {
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
ExpressApp.use(globalErrorHandler);

export default ExpressApp;
