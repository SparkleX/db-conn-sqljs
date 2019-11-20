import { Connection, Result } from 'db-conn'
import * as sqljs  from 'sql.js'
import { } from 'sql.js';

export class SqlJsConnection implements Connection{
	private db: any;
	public constructor() {
		
	}
	public async open(config:any) : Promise<void> {
		this.db = new config.Database();
	}
	public async execute(sql: string, params?: [any]): Promise<Result> {
		console.log(`SqlJsConnection.execute: ${sql}`);
		var result = await this.db.exec(sql, params);
		let rt:Result = new Result();
		rt.rowsAffected = this.db.getRowsModified();
		rt.recordset = [] as any;
		if(result.length>0) {
			var firstResult = result[0];
			var list  = [];
			for(let row of firstResult.values) {
				var data = {};
				for(var index in firstResult.columns) {
					var colName = firstResult.columns[index]
					data[colName] = row[index];
				}
				list.push(data);
			}			
			rt.recordset = list as any;
		}
		return rt;
	}
	public async close():Promise<void> {

	}
	async setAutoCommit(autoCommit:boolean): Promise<void> {
		if(autoCommit) {

		}else{
			await this.execute("begin transaction");
		}
	}
	async commit(): Promise<void> {
		await this.execute("commit");
	}
	async rollback(): Promise<void> {
		await this.execute("rollback");
	}

}