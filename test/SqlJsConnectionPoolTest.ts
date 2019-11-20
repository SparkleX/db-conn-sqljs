import {ConnectionPool, Connection} from "db-conn"
import {SqlJsConnection, SqlJsConnectionPool, initSqlJs} from "../src/index"
import {sqlTest} from "./TestCase"
import {describe,it} from "mocha"
import {expect} from 'chai'

describe(__filename, () => {
    it(__filename, async () => {
		var SQL = await initSqlJs();
		let pool:ConnectionPool = new SqlJsConnectionPool();
		await pool.open(SQL);
		var conn0:Connection = await pool.getConnection();
		var conn1:Connection = await pool.getConnection();
		await conn0.execute("create table test (id, name);");			
		await sqlTest(conn0);
		await sqlTest(conn1);
		await conn0.close();
		await conn1.close();
		await pool.close();
    });
});