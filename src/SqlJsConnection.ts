import { Connection } from 'db-conn'
import * as sqljs  from 'sql.js'
import { } from 'sql.js';

export class SqlJsConnection implements Connection{
	private db: any;
	private resultSet:any[];
	private updateCount:number;

	public constructor() {
		
	}
	public async open(config:any) : Promise<void> {
		this.db = new config.Database();
	}
	public async executeQuery(sql: string, params?: any[]): Promise<any[]> {
		await this.execute(sql, params);
		return this.getResultSet();

	}
	public getResultSet():any[] {
		return this.resultSet;
	}
	public getUpdateCount():number {
		return this.updateCount;
	}

	public async execute(sql: string, params?: any[]): Promise<boolean> {
		console.log(`SqlJsConnection.execute: ${sql} : [${params}]`);
		var stmt = await this.db.prepare(sql,params);
		this.resultSet = [];
		var isResultSet = stmt.step();
		if(isResultSet) {
			var columns:string[] = stmt.getColumnNames();
			do{
				var data:any = {};
				var row = stmt.get();
				for(var index in columns) {
					var colName = columns[index]
					data[colName] = row[index];
				}	
				this.resultSet.push(data);
			}while(stmt.step());
		}

		this.updateCount = this.db.getRowsModified();
		stmt.free();
		return isResultSet;
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