const appConfig = require("./config/config.js");
const expressServer = require("./express.js");
const dbConnect = require("./mongoose.js");
const Chalk = require("../../utils/chalk-messages.js");

async function startServer(): Promise<void> {
	
	await dbConnect();

	expressServer
		.listen(appConfig.port, () => {
			Chalk.running(`🛡️ EXPRESS server listening on port: ${appConfig.port} 🛡️`);
		})
		.on("error", (err: any) => {
			Chalk.fail({ err });
			process.exit(1);
		});
}

startServer();