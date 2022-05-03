const dotenv = require("dotenv"); // read the data from the config file. and use them as env. variables in NODE
const path = require('path');
const chalk = require('../../utils/chalk-messages.js');

// set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || "development";

// LOAD THE .env VARIABLES INTO process.env
if (process.env.NODE_ENV === `development`) {

	const envConfig = dotenv.config({path: path.resolve(__dirname, `../default.env`)}) // IMPORTANT > CONFIGURE ENV. VARIABLES FIRST BEFORE CALLING THE APP 
	
	if (envConfig.error) {
		// this error should crash the whole process
		throw new Error(chalk.fail(`Couldn't find .env file. ${envConfig.error}`));
	};
};

module.exports = Object.freeze({
	
	nodeEnv: process.env.NODE_ENV,

	port: parseInt(process.env.PORT, 10) || 3000,

});