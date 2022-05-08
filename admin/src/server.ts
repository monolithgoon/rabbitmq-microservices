// APP MAIN ENTRY MODULE
import cm from "./utils/chalk-messages";
import { ConsumeMessage, Channel } from "amqplib";
import ExpressApp from "./express";
import appConfig from "./config/config";


// SANDBOX
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

	
const startServer = async () => {

	// SANDBOX
	// REMOVE

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

	ExpressApp.listen(appConfig.port, () => {
		console.log(
			cm.running(
				`🛡️ [ ${appConfig.nodeEnv} ] server listening on port: ${appConfig.port} 🛡️
				`
			)
		);
	}).on("error", (err) => {
		console.error(cm.fail(err));
		process.exit(1);
	});
};


startServer();