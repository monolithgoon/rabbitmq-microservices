import express, { Request, Response, NextFunction, Router } from "express";
import { Connection } from "typeorm";
import Product from "../entity/product";
import { DBConnect } from "../services/db-connect";
import catchAppAsync from "../utils/catch-app-asyc";
import cm from "../utils/chalk-messages";

const router: Router = express.Router();

//
const getAllProducts = (getDBConnection: Function) => catchAppAsync(async (req: Request, res: Response, next: NextFunction) => {

   console.log(cm.highlight(`called getAllProductsHandler_2`));

   const connection: Connection = await getDBConnection();
   
   const productRepository = connection.getRepository(Product);

	const products = await productRepository.find();
	res.json(products);
   
}, "getAllProducts");


//
const createProduct = (getDBConnection: Function) => catchAppAsync(async (req: Request, res: Response, next: NextFunction) => {

	console.log(cm.highlight(`called createProductHandler`));
	console.log(cm.interaction(req.requestTime));

   const connection: Connection = await getDBConnection();

   const productRepository = connection.getRepository(Product);

	const product = await productRepository.create(req.body);
	const result = await productRepository.save(product);

	return res.send(result);

}, "createProduct");

// router.get("/", getAllProducts);
router.get("/", getAllProducts(DBConnect));
// router.post("/", createProduct);
router.post("/", createProduct(DBConnect));

export default router;
