import { Connection} from "db-conn";
import {expect} from 'chai'

export async function sqlTest(conn:Connection):Promise<void> {

	var isResult = await conn.execute("insert into test(id, name) values(1,'a')");
	expect(conn.getUpdateCount()).to.equal(1);
	isResult = await conn.execute("insert into test(id, name) values(?,?)", [2,'b']);
	expect(conn.getUpdateCount()).to.equal(1);

	isResult = await conn.execute("insert into test(id, name) values(3,'c')");
	expect(conn.getUpdateCount()).to.equal(1);

	var resultSet = await conn.executeQuery('select * from test');
	expect(resultSet.length).to.equal(3);
	expect(resultSet[0].id).to.equal(1);
	expect(resultSet[1].id).to.equal(2);

	resultSet = await conn.executeQuery('select * from test where id=?',[1]);
	expect(resultSet.length).to.equal(1);
	expect(resultSet[0].id).to.equal(1);

	isResult = await conn.execute("delete from test");
	expect(conn.getUpdateCount()).to.equal(3);
	return;
}
export async function transactionTest(conn:Connection):Promise<void> {
	await transactionCommit(conn);
	await transactionRollback(conn);

}
export async function transactionRollback(conn:Connection):Promise<void> {
	await conn.setAutoCommit(true);
	var isResult = await conn.execute("delete from test");
	await conn.setAutoCommit(false);
	isResult = await conn.execute("insert into test(id, name) values(1,'a')");
	await conn.rollback();
	isResult = await conn.execute('select * from test');
	expect(conn.getResultSet().length).to.equal(0);
	return;
}

export async function transactionCommit(conn:Connection):Promise<void> {
	await conn.setAutoCommit(true);
	var isResult = await conn.execute("delete from test");
	await conn.setAutoCommit(false);
	isResult = await conn.execute("insert into test(id, name) values(1,'a')");
	await conn.commit();
	isResult = await conn.execute('select * from test');
	expect(conn.getResultSet().length).to.equal(1);
	return;
}