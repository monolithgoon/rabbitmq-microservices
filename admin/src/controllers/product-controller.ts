import { Request, Response, NextFunction } from "express";
import catchServerAsync from "../utils/catch-server-async-error";
import cm from "../utils/chalk-messages";

export const getAllProducts = catchServerAsync(async function getAllProducts(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { productRepository, requestTime } = req;

	console.log(cm.highlight(`called getAllProductsHandler`));
	console.log(cm.interaction(requestTime));

	const products = await productRepository.find();
	res.json(products);
});

export const createProduct = catchServerAsync(async function createProduct(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { productRepository, amqpChannel, requestTime } = req;

	if (amqpChannel) {
		console.log(cm.highlight(`called createProductHandler`));
		console.log(cm.interaction(requestTime));

		const product = await productRepository.create(req.body);
		const result = await productRepository.save(product);

		// console.log(req.amqpChannel);

		amqpChannel.sendToQueue("product_created", Buffer.from(JSON.stringify(result)));

		return res.send(result);
	}

	res.status(500).json({ status: "fail", message: `Check connection to AMQP channel` });
	// return next(new ServerError(`Check connection to AMQP channel`, 500, "createProduct"))
});

export const getProduct = catchServerAsync(async function getProduct(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { productRepository } = req;
	const product = await productRepository.findOne(req.params.id);
	return res.send(product);
});

export const updateProduct = catchServerAsync(async function updateProduct(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { productRepository, amqpChannel, requestTime } = req;
	const product = await productRepository.findOne(req.params.id);
	console.log(cm.highlight({ product }));
	if (product) {
		product && productRepository.merge(product, req.body);
		const result = await productRepository.save(product);
		amqpChannel.sendToQueue("product_updated", Buffer.from(JSON.stringify(result)));
		return res.send(result);
	};
});

export const deleteProduct = catchServerAsync(async function deleteProduct(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { productRepository, amqpChannel } = req;
	const result = await productRepository.delete(req.params.id);
	amqpChannel.sendToQueue("product_deleted", Buffer.from(req.params.id));
	return res.send(result);
});

export const likeProduct = catchServerAsync(async function likeProduct(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { productRepository } = req;
	const product = await productRepository.findOne(req.params.id);
	if (product) {
		product.likes++;
		const result = await productRepository.save(product);
		return res.send(result);
	};
});