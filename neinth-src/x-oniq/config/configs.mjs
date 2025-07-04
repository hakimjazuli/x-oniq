// @ts-check

import { NeinthComponent } from 'neinth';

/**
 * @typedef {import('../core/Configs.mjs').Configs} Configs
 */
/**
 * @type {NeinthComponent<
 * undefined|Configs,
 * undefined
 * >}
 */
const neinthInstance = new NeinthComponent(async function () {
	const Configs_ = this.listenToNeinth('neinth-src/x-oniq/core/Configs.mjs');
	return this.updateValue$({
		neinthInstance,
		mode: 'mostRecent',
		derived: async () => {
			const Configs = Configs_.value;
			if (!Configs) {
				return;
			}
			return new Configs({
				sqlPath: 'sqls',
				frontendMjs: 'dev/frontend/js/type.mjs',
				backendBasePath: 'backend/sqlMap',
				inputFieldStartsWith: ':',
				async loopHandler() {},
				async postLoopHandler() {},
			});
		},
	});
});
export default neinthInstance;
