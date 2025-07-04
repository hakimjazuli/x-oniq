// @ts-check

import { NeinthComponent } from 'neinth';

/**
 * @type {NeinthComponent<
 * void,
 * undefined
 * >}
 */
const neinthInstance = new NeinthComponent(async function () {
	const config_ = this.listenToNeinth('neinth-src/x-oniq/config/configs.mjs');
	this.new$(async () => {
		const config = config_.value;
		if (!config) {
			return;
		}
		this.generateWatcher({
			relativePath: config.sqlPath,
			addDirToSet: false,
			addFileToSet: true,
			encoding: 'utf8',
		});
	});
	const sqlInfosClass_ = this.listenToNeinth('neinth-src/x-oniq/core/SQLInfos.mjs');
	const watcher_ = this.listenToGeneratedWatcher();
	this.new$(async () => {
		const watcher = watcher_.value;
		const config = config_.value;
		const sqlInfosClass = sqlInfosClass_.value;
		if (!watcher || !sqlInfosClass || !config) {
			return;
		}
		this.safeUniquePing('watcher:loop', async () => {
			const { infos } = watcher;
			const returnedFromHandler = new Set();
			for (const info of infos) {
				returnedFromHandler.add(
					await config.loopHandler(new sqlInfosClass({ info, configInstance: config }))
				);
			}
			config.postLoopHandler(returnedFromHandler);
		});
	});
});
export default neinthInstance;
