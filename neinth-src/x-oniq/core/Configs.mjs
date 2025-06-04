// @ts-check

import { neinth } from 'neinth';

/**
 * @description
 * - main config file, to be loaded and instantiated on your `config`
 */
/**
 * @template ReturnedFromHandler
 */
export class Configs {
	/**
	 * @typedef {import('./SQLInfos.mjs').SQLInfos} sqlInfos
	 */
	/**
	 * @param {Object} param0
	 * @param {string} param0.sqlPath
	 * - dir watcher
	 * @param {string} param0.frontendMjs
	 * - path to generated frontEnd module
	 * @param {string} param0.backendBasePath
	 * - base path for backend
	 * @param {(sqlInfos:sqlInfos)=>Promise<ReturnedFromHandler>} param0.loopHandler
	 * - main handler for `sqlInfos`;
	 * - should return value to be used by `postHandler` `Parameter[0]`;
	 * @param {(SetOfReturnedFromHandler:Set<ReturnedFromHandler>)=>Promise<void>} param0.postLoopHandler
	 * - `Parameter[0]` are `Set` of the `handler` `returnedValue`;
	 * @param {string} [param0.inputFieldStartsWith]
	 * - default: colon `:`;
	 */
	constructor({
		sqlPath,
		frontendMjs,
		backendBasePath,
		loopHandler,
		inputFieldStartsWith = ':',
		postLoopHandler,
	}) {
		/**
		 * @type {string}
		 */
		this.sqlPath = sqlPath;
		/**
		 * @type {string}
		 */
		this.frontendMjs = frontendMjs;
		/**
		 * @type {string}
		 */
		this.backendBasePath = backendBasePath;
		this.loopHandler = loopHandler;
		this.postLoopHandler = postLoopHandler;
		/**
		 * @type {string}
		 */
		this.inputFieldStartsWith = inputFieldStartsWith;
	}
	/**
	 * @type {(sqlInfos:sqlInfos)=>Promise<ReturnedFromHandler>}
	 */
	loopHandler;
	/**
	 * @type {(SetOfReturnedFromHandler:Set<ReturnedFromHandler>)=>Promise<void>}
	 */
	postLoopHandler;
}

export default new neinth(async () => {
	return Configs;
});
