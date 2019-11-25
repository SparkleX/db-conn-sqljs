import {DdlBuilder, MdTable, MdColumn} from "db-conn";

export class SqlJsDdlBuilder implements DdlBuilder {
	private q = '';
	public createTable(mdTable: MdTable): string[] {
		var columns = "";
		for(let col of mdTable.columns ) {
			columns = columns + `${col.name},`;
		}
		columns = columns.substr(0, columns.length-1);
		var sql = `create table ${mdTable.name} (${columns})`
		return [sql];
	}	
	public insertSql(mdTable: MdTable): string {
		var columns = this.sqlInsertColumns(mdTable.columns);
		var values = this.sqlInsertParams(mdTable.columns);
		return `insert into ${mdTable.name} (${columns}) values (${values})`;
	}
	public insertData(mdTable: MdTable, data: object[]): any[][] {
		var rt:any[][] = [];
		for(let row of data) {
			var rowArray:any[] = [];
			for(let col of mdTable.columns ) {
				rowArray.push((row as any)[col.name]);
			}
			rt.push(rowArray);
		}
		return rt;
	}
	private sqlInsertColumns(columns: MdColumn[]) {
		var rt = "";
		for(let col of columns) {
			rt = rt  + `${this.q}${col.name}${this.q},`;
		}
		var sql = rt.substr(0, rt.length-1);
		return sql;
	}	
	private sqlInsertParams(columns: MdColumn[]) {
		var rt = "";
		for(let col of columns) {
			rt = rt  + `?,`;
		}
		var sql = rt.substr(0, rt.length-1);
		return sql;
	}
}