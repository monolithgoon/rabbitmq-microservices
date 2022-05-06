import express, { Express, Request, Response, NextFunction } from "express";
import Chalk from "./utils/chalk-messages";

// SANDBOX
import client, { Connection, ConsumeMessage, Channel } from "amqplib";
import { DBConnect } from "./services/db-connect";
import ExpressApp from "./express";
import Product from "./entity/product";


// Function to send some messages before consuming the queue
const sendMessages = (channel: Channel) => {
	for (let i = 0; i < 10; i++) {
		channel.sendToQueue("myQueue", Buffer.from(`message ${i}`));
	};
};


// consumer for the queue.
// We use currying to give it the channel required to acknowledge the message
const consumer =
	(channel: Channel) =>
	(msg: ConsumeMessage | null): void => {
		if (msg) {
			// Display the received message
			console.log(msg.content.toString());
			// Acknowledge the message
			channel.ack(msg);
		}
	};

	
// 
const startServer = async () => {

	// const ormConnection = await DBConnect();
	// console.log({ormConnection})

	// const productRepository = ormConnection.getRepository(Product);
	// // console.log({productRepository})
	
	// // CLOUD AMQP STRING
	// const amqpUrl = `amqps://fhzyldga:0DNCJI95lxdyn2rfdQybKP8bz-g30LgA@hawk.rmq.cloudamqp.com/fhzyldga`;
	
	// // EST. AMQP CONNECTION
	// const amqpConnection: Connection = await client.connect(amqpUrl);
	// // console.log({amqpConnection})
	
	// // Create a channel
	// const amqpChannel: Channel = await amqpConnection.createChannel();
	// // console.log({amqpChannel})

	// // Makes the queue available to the client
	// await amqpChannel.assertQueue("myQueue");

	// // Send some messages to the queue
	// sendMessages(amqpChannel);

	// // Start the consumer
	// await amqpChannel.consume("myQueue", consumer(amqpChannel));

	const PORT = 8000;
	// ExpressApp.listen(appConfig.port, () => {
	ExpressApp.listen(PORT, () => {
		console.log(
			Chalk.running(
				// `🛡️ EXPRESS server listening on port: ${appConfig.port} 🛡️`
				`🛡️ EXPRESS server listening on port: ${PORT} 🛡️`
			)
		);
	}).on("error", (err) => {
		console.error(Chalk.fail(err));
		process.exit(1);
	});
};


startServer();