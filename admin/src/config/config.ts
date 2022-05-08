import dotenv from "dotenv";
import path from "path";
import cm from "../utils/chalk-messages";

//IMPORTANT > dotenv.config() MUST FIRST BE CALLED IN THIS MODULE BEFORE THE APP ENTRY @ server.ts
dotenv.config(); 

let envVariables;

// SELECT DEV. OR PROD. ENV. VARS
if (process.env.NODE_ENV === `development`) {

	envVariables = dotenv.config({ path: path.resolve(__dirname, `../../default.env`) });

	if (envVariables.error) {
		// this error should crash the whole process
		throw new Error(cm.fail(`Couldn't find .env file. ${envVariables.error}`));
	}
} else if (process.env.NODE_ENV === `production`) {
	envVariables = dotenv.config({path: path.resolve(__dirname, `../produciton.env`)});
};

export default Object.freeze({
	nodeEnv: process.env.NODE_ENV,
	port: process.env.PORT,
	amqpUrl: process.env.CLOUD_AMQP_URL,
});
