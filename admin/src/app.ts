import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { createConnection } from "typeorm";
import Product from "./entity/product";
import amqp, { Connection, Channel } from "amqplib/callback_api";
import chalk from "./utils/chalk-messages";
import { DBConnect } from "./utils/db-connect";


createConnection().then((db) => {
	
	const productRepository = db.getRepository(Product);

	const amqpUrl = `amqps://fhzyldga:0DNCJI95lxdyn2rfdQybKP8bz-g30LgA@hawk.rmq.cloudamqp.com/fhzyldga`;

	amqp.connect(amqpUrl, (error0, connection: Connection) => {
		if (error0) {
			throw error0;
		};

		connection.createChannel((error1, channel: Channel) => {
			if (error1) {
				throw error1;
			};

			const ExpressApp : Express = express();

			ExpressApp.use(
				cors({
					origin: ["http://localhost:3000", "http://localhost:8080", "http://localhost:3001"],
				})
			);

			ExpressApp.use(express.json());

			ExpressApp.get("/api/products", async (req: Request, res: Response) => {
				const products = await productRepository.find();
				res.json(products);
			});

			ExpressApp.post("/api/products", async (req: Request, res: Response) => {
				const product = await productRepository.create(req.body);
				const result = await productRepository.save(product);
				channel.sendToQueue("product_created", Buffer.from(JSON.stringify(result)));
				// SANDBOX
				channel.sendToQueue("my_test_message", Buffer.from("Find The Source"));
				return res.send(result);
			});

			ExpressApp.get("/api/products/:id", async (req: Request, res: Response) => {
				const product = await productRepository.findOne(req.params.id);
				return res.send(product);
			});

			ExpressApp.put("/api/products/:id", async (req: Request, res: Response) => {
				const product = await productRepository.findOne(req.params.id);
				console.log(chalk.highlight({ product }));
				productRepository.merge(product, req.body);
				const result = await productRepository.save(product);
				channel.sendToQueue("product_updated", Buffer.from(JSON.stringify(result)));
				return res.send(result);
			});

			ExpressApp.delete("/api/products/:id", async (req: Request, res: Response) => {
				const result = await productRepository.delete(req.params.id);
				channel.sendToQueue("product_deleted", Buffer.from(req.params.id));
				return res.send(result);
			});

			ExpressApp.post("/api/products/:id/like", async (req: Request, res: Response) => {
				const product = await productRepository.findOne(req.params.id);
				product.likes++;
				const result = await productRepository.save(product);
				return res.send(result);
			});

			ExpressApp.listen(8000);
			console.log(chalk.running(`SERVER LISTENING ON PORT: 8000`));
			process.on("beforeExit", () => {
				console.log("closing");
				connection.close();
			});
		});
	});
});
