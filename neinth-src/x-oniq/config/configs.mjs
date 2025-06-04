// @ts-check

import { neinth } from 'neinth';

/**
 * this is an neinth-script example
 */
export default new neinth(async ({ importNeinth }) => {
	const configs = importNeinth('neinth-src/x-oniq/core/Configs.mjs').value;
	if (!configs) {
		return;
	}
	return new configs({
		sqlPath: 'sqls',
		frontendMjs: 'dev/frontend/js/type.mjs',
		backendBasePath: 'backend/sqlMap',
		inputFieldStartsWith: ':',
		async loopHandler(sqlInfos) {
			return sqlInfos.fields;
		},
		async postLoopHandler(set_) {
			console.dir({ fields: set_ }, { depth: null });
		},
	});
});
