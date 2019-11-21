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
	public async execute(sql: string, params?: any[]): Promise<Result> {
		console.log(`SqlJsConnection.execute: ${sql} : [${params}]`);
	/*	if(sql.toLowerCase().startsWith("insert into")) {
			return await this.executeInsert(sql, params);
		}*/
		var stmt = await this.db.prepare(sql,params);
		let rt:Result = new Result();
		rt.recordset = [];
		var isResultSet = stmt.step();
		if(isResultSet) {
			var columns:string[] = stmt.getColumnNames();
			do{
				var data = {};
				var row = stmt.get();
				for(var index in columns) {
					var colName = columns[index]
					data[colName] = row[index];
				}	
				rt.recordset.push(data);
			}while(stmt.step());
		}

		rt.rowsAffected = this.db.getRowsModified();
		stmt.free();
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