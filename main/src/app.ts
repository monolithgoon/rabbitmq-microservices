import express, { Express, Request, Response } from "express";
import cors from "cors";
import { createConnection } from "typeorm";
import amqp, { Connection, Channel, ConsumeMessage } from "amqplib/callback_api";
import { Product } from "./entity/product";
import axios from "axios";

createConnection().then((db) => {
	const productRepository = db.getMongoRepository(Product);

	const amqpUrl = `amqps://fhzyldga:0DNCJI95lxdyn2rfdQybKP8bz-g30LgA@hawk.rmq.cloudamqp.com/fhzyldga`;

	amqp.connect(amqpUrl, (error0, connection: Connection) => {

		if (error0) {
			throw error0;
		}

		connection.createChannel((error1, channel: Channel) => {

			if (error1) {
				throw error1;
			}

			channel.assertQueue("hello", {durable: false})
			channel.assertQueue("product_created", { durable: false });
			channel.assertQueue("product_updated", { durable: false });
			channel.assertQueue("product_deleted", { durable: false });


			// EXPRESS INIT. && EXPRESS MIDDLEWARES

			const ExpressApp: Express = express();

			ExpressApp.use(
				cors({
					origin: ["http://localhost:3000", "http://localhost:8080", "http://localhost:3001"],
				})
			);

			ExpressApp.use(express.json());


			// CONSUMERS
			channel.consume("my_test_message", async (msg: ConsumeMessage | null) => {
				console.log(msg?.content.toString());
			})

			channel.consume("product_created",
				async (msg: ConsumeMessage | null) => {
					const eventProduct: Product = JSON.parse(msg.content.toString());
					const product = new Product();
					product.admin_product_id = parseInt(eventProduct.id);
					product.title = eventProduct.title;
					product.image = eventProduct.image;
					product.likes = eventProduct.likes;
					await productRepository.save(product);
					console.log("product created");
				},
				{ noAck: true }
			);

			channel.consume("product_updated",
				async (msg: ConsumeMessage | null) => {
					const eventProduct = JSON.parse(msg.content.toString());
					const product: Product = await productRepository.findOne({admin_product_id: parseInt(eventProduct.id)});
					productRepository.merge(product, {
						title: eventProduct.title,
						image: eventProduct.image,
						likes: eventProduct.likes,
					});
					await productRepository.save(product);
					console.log("product updated");
				},
				{ noAck: true }
			);

			channel.consume("product_deleted", async (msg: ConsumeMessage | null) => {
				const admin_product_id = parseInt(msg.content.toString());
				await productRepository.deleteOne({ admin_product_id });
				console.log("product deleted");
			});

			ExpressApp.get("/api/products", async (req: Request, res: Response) => {
				const products = await productRepository.find();
				return res.send(products);
			});

			ExpressApp.post("/api/products/:id/like", async (req: Request, res: Response) => {
				const product = await productRepository.findOne(req.params.id);
				await axios.post(
					`http://localhost:8000/api/products/${product.admin_product_id}/like`,
					{}
				);
				product.likes++;
				await productRepository.save(product);
				return res.send(product);
			});

			console.log("Listening to port: 8001");
			ExpressApp.listen(8001);
			process.on("beforeExit", () => {
				console.log("closing");
				connection.close();
			});
		});
	});
});
