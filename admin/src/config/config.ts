import dotenv from "dotenv";
import path from "path";
import cm from "../utils/chalk-messages";

let envVariables;

// set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

// LOAD THE .env VARIABLES INTO process.env
if (process.env.NODE_ENV === `development`) {

	envVariables = dotenv.config({ path: path.resolve(__dirname, `../../default.env`) }); // IMPORTANT > CONFIGURE ENV. VARIABLES FIRST BEFORE CALLING THE APP

	if (envVariables.error) {
		// this error should crash the whole process
		throw new Error(cm.fail(`Couldn't find .env file. ${envVariables.error}`));
	}
} else if (process.env.NODE_ENV === `production`) {
	// envVariables = dotenv.config({path: path.resolve(__dirname, `../produciton.env`)}) // IMPORTANT > CONFIGURE ENV. VARIABLES FIRST BEFORE CALLING THE APP
};

export default Object.freeze({
	nodeEnv: process.env.NODE_ENV,
	port: process.env.PORT || 3000,
	amqpUrl: process.env.CLOUD_AMQP_URL,
});
