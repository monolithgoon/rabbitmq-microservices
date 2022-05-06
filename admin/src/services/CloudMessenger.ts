import client, { Connection, ConsumeMessage, Channel } from "amqplib";

export default class CloudMessenger {
   cloudUrl: string;
   queue: string;
   constructor(cloudUrl: string) {
      this.cloudUrl = cloudUrl;
      this.queue = ""
   };

	// // CLOUD AMQP STRING
	// const amqpUrl: string = `amqps://fhzyldga:0DNCJI95lxdyn2rfdQybKP8bz-g30LgA@hawk.rmq.cloudamqp.com/fhzyldga`;

   async setupConnection(q: string) {
      let connection: Connection = await client.connect(this.cloudUrl);
      let channel: Channel = await connection.createChannel();
      await channel.assertQueue(q, {durable: false});
   };

   sendMsg(msg: string) {
      channel.sendToQueue()
   }
}


// OLD WAY OF CREATING CLASSES
export class MQ {

   // 1. SET THE CLASS PROP
   cloudUrl: string;

   // 2. DECLARE PROP AS PUBLIC IN CONSTRUCTOR
   constructor (cloudUrl: string) {

      // 3. ASSIGN CLASS PROP. TO CONSTRUCTOR PARAM
      this.cloudUrl = cloudUrl;
   }
}

export class MQ_ {

   // public prop. of class > not used in constructor
   instantiatedAt = new Date();
	cloudUrlDefault: string = `amqps://fhzyldga:0DNCJI95lxdyn2rfdQybKP8bz-g30LgA@hawk.rmq.cloudamqp.com/fhzyldga`;
   mqConnection: Connection | undefined;
   mqChannel: Channel | undefined;
   queueName: string = "";

   // parameter properties: 
   // Set the class params. in the constructor, 
   // w/out needing to set them in the class body and constructor parameter list

   constructor (public cloudUrl: string) {
   }

   public async setupConnection(queueName: string): Promise<void> {

      this.mqConnection = await client.connect(this.cloudUrlDefault);
      this.mqChannel = await this.mqConnection.createChannel();

      await this.mqChannel.assertQueue(queueName, {durable: false});
   };

   sendMessage(msg: string) {
      this.mqChannel?.sendToQueue(this.)
   }
}

