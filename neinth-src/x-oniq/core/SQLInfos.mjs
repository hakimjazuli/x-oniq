// @ts-check

import { neinth } from 'neinth';

/**
 * @description
 * - class definition for parser and collections of the sole data truth to be handled via `Configs` `handlers`:
 * >- `param0.loopHandler`, and;
 * >- `param0.postLoopHandler`;
 * - example on how `config/configs.mjs` looks like:
 * ```js
 * // @ts-check
 *
 *import { neinth } from 'neinth';
 *
 * /**
 *  * this is an neinth-script example
 *  *[blank]/
 *	export default new neinth(async ({ importNeinth, writeFile }) => {
 *		const configs = importNeinth('neinth-src/x-oniq/core/Configs.mjs').value;
 *		if (!configs) {
 *			return;
 *		}
 *		return new configs({
 *			sqlPath: 'sqls',
 *			frontendMjs: 'dev/frontend/js/type.mjs',
 *			backendBasePath: 'backend/sqlMap',
 *			inputFieldStartsWith: ':',
 *			async loopHandler(sqlInfos) {
 *				// all configs option arguments are passed to sqlInfos.sqlInfos.configInstance;
 *				// writeFile({ ...options });
 *				return sqlInfos.fields;
 *			},
 *			async postLoopHandler(set_) {
 *				console.dir({ fields: set_ }, { depth: null });
 *				// writeFile({ ...options });
 *			},
 *		});
 *	});
 * ```
 * - try to create:
 * >- `sqls`
 * >>- `myQuery.sql`
 * ```sql
 * select a as b from myTable where id= :user_id
 * ```
 */
export class SQLInfos {
	/**
	 * @typedef {import('neinth').infos} Info
	 */
	/**
	 * @param {Object} a0
	 * @param {Info} a0.info
	 * @param {import('./Configs.mjs').Configs} a0.configInstance
	 */
	constructor({ info, configInstance }) {
		/**
		 * @type {Info}
		 * - native `Infos` of neinth;
		 */
		this.info = info;
		/**
		 * @type {configInstance}
		 * - `Config` values;
		 */
		this.configInstance = configInstance;
		/**
		 * @type {{output:SQLInfos['outputFields'],input:SQLInfos['inputFields']}}
		 */
		this.fields = { output: this.outputFields, input: this.inputFields };
	}
	/**
	 * @typedef {Object} sqlRelativePath
	 * @property {Object} path
	 * - details of `relativePath`;
	 * @property {Array<string>} path.array
	 * - `relativePath` as `array`;
	 * @property {string} path.string
	 * - `relativePath` as `string`;
	 * @property {string} ext
	 * - `fileExtention`
	 * @property {Object} name
	 * - details of `fileName`;
	 * @property {string} name.full
	 * - `fileName` with extention;
	 * @property {string} name.noExt
	 * - `fileName` without extention;
	 * @property {Array<string>} name.details
	 * - `fileName` splited by dot ".";
	 */
	/**
	 * @type {sqlRelativePath}
	 * - `relativePath` details;
	 */
	get sqlRelativePath() {
		if (this.relativePathDetails) {
			return this.relativePathDetails;
		}
		const fullPath = this.info.path.relative
			.replace(new RegExp(`${this.configInstance.sqlPath}(\\\\|\/)`, 'g'), '')
			.replace(/\\/g, '/');
		const pathArray = fullPath.split('/');
		const fullName = pathArray[pathArray.length - 1];
		const nameArray = fullName.split('.');
		const lastIndex = nameArray.length - 1;
		const ext = nameArray[lastIndex];
		const details = nameArray.slice(0, lastIndex);
		return (this.relativePathDetails = {
			path: { string: fullPath, array: pathArray },
			ext,
			name: { full: fullName, noExt: fullName.replace(`.${ext}`, ''), details },
		});
	}
	/**
	 * @private
	 * @type {undefined|sqlRelativePath}
	 */
	relativePathDetails = undefined;
	/**
	 * @type {Info['content']}
	 */
	get content() {
		return this.info.content?.replace(/\s+/g, ' ');
	}
	/**
	 * @private
	 * @param {string[]} strings
	 * @returns {string[]}
	 */
	static toUnqoute(strings) {
		for (let i = 0; i < strings.length; i++) {
			strings[i] = strings[i].replace(/'|"|`/g, '');
		}
		return strings;
	}
	/**
	 * @private
	 * @type {string[]}
	 */
	get outputFields() {
		return SQLInfos.toUnqoute(SQLInfos.getOutputFields(this.content));
	}
	/**
	 * Extracts and returns the list of fields that will be returned by any SQL query.
	 * It works for both standard SELECT queries and INSERT/UPDATE/DELETE queries with a RETURNING clause.
	 *
	 * @private
	 * @param {string|undefined} sql - The raw SQL query string.
	 * @returns {string[]} An array of output field names.
	 */
	static getOutputFields(sql) {
		if (!sql) {
			return [];
		}
		/**
		 * Try to match the RETURNING clause first.
		 */
		const returningRegex = /RETURNING\s+([\s\S]*?)(?=\s+(WHERE|ON)|;|$)/i;
		let match = sql.match(returningRegex);
		let fieldsStr = '';
		if (match) {
			fieldsStr = match[1].trim();
		} else {
			/**
			 * Fallback: try matching a standard SELECT clause.
			 * This regex captures everything between the first SELECT and the first FROM.
			 */
			const selectRegex = /SELECT\s+([\s\S]*?)\s+FROM/i;
			match = sql.match(selectRegex);
			if (match) {
				fieldsStr = match[1].trim();
			}
		}
		if (!fieldsStr) {
			return [];
		}
		/**
		 * Split on commas that are not inside parentheses.
		 */
		const fields = [];
		let field = '';
		let parenCount = 0;
		for (let i = 0; i < fieldsStr.length; i++) {
			const char = fieldsStr[i];
			if (char === '(') {
				parenCount++;
			}
			if (char === ')') {
				parenCount--;
			}
			/**
			 * Only split on commas if not within a parentheses pair.
			 */
			if (char === ',' && parenCount === 0) {
				fields.push(field.trim());
				field = '';
			} else {
				field += char;
			}
		}
		if (field.trim()) {
			fields.push(field.trim());
		}
		/**
		 * Process each field:
		 * - If it has an alias (using "AS"), then the alias is the returned name.
		 * - Otherwise, if it has a qualified name (e.g. table.column), return the column part.
		 * - Otherwise, return the trimmed field expression.
		 */
		return fields.map((f) => {
			const asMatch = f.match(/\s+AS\s+(["'`]?)([\w\d_]+)\1$/i);
			if (asMatch) {
				return asMatch[2];
			}
			/**
			 * For qualified names like "table.column", capture the part after the dot.
			 */
			const dotMatch = f.match(/(?:\w+\.)?(\w+)$/);
			if (dotMatch) {
				return dotMatch[1];
			}
			return f;
		});
	}
	/**
	 * @private
	 * @type {string[]}
	 */
	get inputFields() {
		return SQLInfos.getInputFields(this.content, this.configInstance.inputFieldStartsWith);
	}
	/**
	 * Extracts input fields from a SQL query that use colon-prefixed parameters.
	 *
	 * @private
	 * @param {string|undefined} sql
	 * - The raw SQL query string.
	 * @param {string|undefined} [startsWith]
	 * - identifier, input fields startsWith.
	 * - default: colon ":";
	 * @returns {string[]}
	 * Array of parameter names.
	 */
	static getInputFields(sql, startsWith = ':') {
		if (!sql) {
			return [];
		}
		const regex = new RegExp(`${startsWith}([A-Za-z_][A-Za-z0-9_]*)`, 'g');
		const fields = new Set();
		let match;
		while ((match = regex.exec(sql)) !== null) {
			fields.add(match[1]);
		}
		return Array.from(fields);
	}
}

export default new neinth(async () => {
	return SQLInfos;
});
