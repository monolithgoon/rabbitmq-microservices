import { Connection, createConnection, getConnection, getConnectionManager, getConnectionOptions } from "typeorm";
import ORM_CONFIG from "../ormconfig";
import Chalk from "../utils/chalk-messages";

export const DBConnect = async () => {

	let connection: Connection | undefined;

	try {

		// SANITY CHECK MTD. 1
		// SANITY CHECK BEFORE ESTABLISHING A CONNECTION

		// CHECK IF THE DEFAULT DB CONNECTION CURRENTLY EXISTS
		if (!getConnectionManager().has("default")) {

			// READ CONN. OPTIONS FROM ormconfig.json
			const connectionOptions = await getConnectionOptions();
			console.log({connectionOptions})

			// MAKE CONNECTION
			// connection = await createConnection(connectionOptions);
			// await createConnection(ORM_CONFIG);
			connection = await createConnection(); // no args. => reads directly from ormconfig.json

		} else {
			connection = getConnection();
		};

		
		// SANDBOX
		// REMOVE > DUPLICAITON
		// SANITY CHECK MTD. 2
		if (connection) {
			if (!connection.isConnected) {
				await connection.connect();
			};
		} else {
			connection = await createConnection(ORM_CONFIG);
			// connection = await createConnection();
		};
		
		
		console.log(Chalk.connected("🌴 DATABASE CONNECTION WAS SUCCESSFUL"));
		console.log(getConnectionManager());

		return connection;


	} catch (dbConnectErr) {
		console.error("ERROR: DATABASE CONNECTION FAILED", dbConnectErr);
		throw dbConnectErr;
	};
};

export const TryDBConnect = async (onError: Function, next?: Function) => {
	try {
		await DBConnect();
		if (next) {
			next();
		}
	} catch (e) {
		onError();
	}
};
