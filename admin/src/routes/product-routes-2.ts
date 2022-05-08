import express, { Request, Response, NextFunction, Router } from "express";
import { Connection } from "typeorm";
import Product from "../entity/product";
import DatabaseConnection from "../services/DatabaseConnection";
import catchAppAsync from "../utils/catch-error-async";
import cm from "../utils/chalk-messages";

const router: Router = express.Router();

// SANDBOX
// MODULE-LEVEL CACHE USING PROMISES
const ormConnection: Promise<Connection> = new DatabaseConnection().returnConnection("default");

//
const createProduct = catchAppAsync(async (req: Request, res: Response, next: NextFunction) => {
	
	console.log(cm.highlight(`called createProductHandler`));
	console.log(cm.interaction(req.requestTime));

	const connection: Connection = await ormConnection;

	const productRepository = connection.getRepository(Product);

	const product = await productRepository.create(req.body);
	const result = await productRepository.save(product);

	return res.send(result);
}, "createProduct");

router.post("/", createProduct);

export default router;
