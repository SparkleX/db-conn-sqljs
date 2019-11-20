import { ConnectionPool,Connection } from 'db-conn';
import {SqlJsConnection} from "./SqlJsConnection";

export class SqlJsConnectionPool implements ConnectionPool{
	private conn: SqlJsConnection;
	public async open(config:any):Promise<void> {
		this.conn = new SqlJsConnection();
		this.conn.open(config);
	}

	public async getConnection():Promise<Connection> {
		return this.conn;
	}
	public async close():Promise<void> {
		
	}

}