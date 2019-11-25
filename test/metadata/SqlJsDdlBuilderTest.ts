import { ConnectionPool, Connection,DdlBuilder, Metadata, MdTable } from "db-conn"
import { SqlJsDdlBuilder, SqlJsConnection,initSqlJs } from "../../src/index"
import { describe,it } from "mocha"
import * as chai from 'chai'
import * as fs from 'fs'
describe(__filename, () => {
    it("SqlJsDdlBuilder.createTable", async () => {
		var SQL = await initSqlJs();
		var conn:Connection = new SqlJsConnection();
		conn.open(SQL);
		var table:MdTable = await Metadata.load("test/metadata/table/Exam.json");
		var ddlBuilder:DdlBuilder = new SqlJsDdlBuilder();
		var sqls = ddlBuilder.createTable(table);
		await conn.execute(sqls[0]);

		var sql = ddlBuilder.insertSql(table);
		console.dir(sql);
		let rawdata = fs.readFileSync("test/metadata/data/Exam.data.json").toString();
		var data = JSON.parse(rawdata);
		var paramsArray = ddlBuilder.insertData(table, data);
		for(let param of paramsArray) {
			await conn.execute(sql, param);
		}
		var listExam = await conn.executeQuery("select * from Exam");
		chai.expect(listExam.length).to.equals(2);
		chai.expect(listExam).to.eql(data);
    });
});