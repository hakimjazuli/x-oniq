// @ts-check

import { neinth } from 'neinth';
import { trySync } from 'vivth';

export default new neinth(async ({ importNeinth, getInfos }) => {
	const configInstance = importNeinth('neinth-src/x-oniq/config/configs.mjs').value;
	const sqlInfosClass = importNeinth('neinth-src/x-oniq/core/SQLInfos.mjs').value;
	const [sqlFiles, error] = trySync(() => {
		const sqlPath = configInstance?.sqlPath ?? '';
		return getInfos(sqlPath, { file: true, dir: false }, 'utf-8').value;
	});
	if (!configInstance || error || !sqlFiles || !sqlInfosClass) {
		return;
	}
	const returnedFromHandler = new Set();
	await sqlFiles.forEach(async (info) => {
		returnedFromHandler.add(
			await configInstance.loopHandler(new sqlInfosClass({ info, configInstance }))
		);
	});
	configInstance.postLoopHandler(returnedFromHandler);
});
