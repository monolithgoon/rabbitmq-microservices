import { Request, Response, NextFunction } from "express";
import HttpStatusCodes from "../consts/HttpStatusCodes";
import AppError from "../utils/AppError";
import catchAppAsync from "../utils/catch-app-asyc";
import cm from "../utils/chalk-messages";

export const getAllProducts = catchAppAsync(async function getAllProducts(
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

export const createProduct = catchAppAsync(async function createProduct(
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

	return next(new AppError(HttpStatusCodes.INTERNAL_SERVER_ERROR, `Broken APQP channel connection; check internet connection`, `@createProduct`))
});

export const getProduct = catchAppAsync(async function getProduct(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { productRepository } = req;
	const product = await productRepository.findOne(req.params.id);
	return res.send(product);
});

export const updateProduct = catchAppAsync(async function updateProduct(
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

export const deleteProduct = catchAppAsync(async function deleteProduct(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { productRepository, amqpChannel } = req;
	const result = await productRepository.delete(req.params.id);
	amqpChannel.sendToQueue("product_deleted", Buffer.from(req.params.id));
	return res.send(result);
});

export const likeProduct = catchAppAsync(async function likeProduct(
	req: Request,
	res: Response,
	next: NextFunction
	) {
	const { productRepository, amqpChannel } = req;
	const product = await productRepository.findOne(req.params.id);
	if (product) {
		product.likes++;
		const result = await productRepository.save(product);
		amqpChannel.sendToQueue("product_liked", Buffer.from(req.params.id));
		return res.send(result);
	};
});