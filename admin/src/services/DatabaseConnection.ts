import {
	Connection,
	ConnectionManager,
	ConnectionOptions,
	createConnection,
	getConnectionManager,
	getConnectionOptions,
} from "typeorm";
import ORM_CONFIG from "../ormconfig";
import cm from "../utils/chalk-messages";


export default class DatabaseConnection {
	private connectionManager: ConnectionManager;

	constructor() {
		this.connectionManager = getConnectionManager();
	};

	public async returnConnection(name: string): Promise<Connection> {
		const CONNECTION_NAME: string = name || "default";
		let connection: Connection;
		const hasConnection = this.connectionManager.has(CONNECTION_NAME);

		if (hasConnection) {

			connection = this.connectionManager.get(CONNECTION_NAME);
			// connection = getConnection();

			if (!connection.isConnected) {
				connection = await connection.connect();
			};

		} else {
         
         const connectionOptions: ConnectionOptions = await getConnectionOptions();
			console.log({ connectionOptions });

			connection = await createConnection(connectionOptions);
         // connection = await createConnection(); <= alt. mtd. 1 < reads directly from ORM_CONFIG.json
         // connection = await createConnection(ORM_CONFIG); <= alt. mtd. 2
		};

      console.log(cm.connected("🌴 DATABASE CONNECTION WAS SUCCESSFUL"));
		console.log(getConnectionManager());

		return connection;
	}
}
