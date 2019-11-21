import {Connection} from "db-conn"
import {SqlJsConnection, initSqlJs} from "../src/index"
import {describe,it} from "mocha"
import { sqlTest, transactionTest } from "./TestCase"

describe(__filename, () => {
    it(__filename, async () => {
		var SQL = await initSqlJs();
		var conn:Connection = new SqlJsConnection();
		await conn.open(SQL);
		await conn.execute("create table test (id integer primary key, name);");
		await sqlTest(conn);
		await transactionTest(conn);
		await conn.close();
    });
});