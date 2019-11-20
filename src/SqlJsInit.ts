import * as sqljs  from 'sql.js'

export async function initSqlJs():Promise<any> {
	return new Promise((resolve, reject) =>
		sqljs().then(function (SQL) {
			resolve(SQL);
	}));
}