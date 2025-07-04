// @ts-check

import { NeinthComponent } from 'neinth';

/**
 * @description
 * - class definition for parser and collections of the sole data truth to be handled via `Configs` `handlers`:
 * >- `param0.loopHandler`, and;
 * >- `param0.postLoopHandler`;
 * - example on how `config/configs.mjs` looks like:
 * ```js
 *  // @ts-check
 *
 * import { NeinthComponent } from 'Neinth';
 *
 * /**
 *  * @typedef {import('../core/Configs.mjs').Configs} Configs
 *  *[blank]/
 * /**
 *  * @type {NeinthComponent<undefined|Configs,undefined>}
 *  *[blank]/
 * const neinthInstance = new NeinthComponent(async function () {
 * 	const Configs_ = this.listenToNeinth('neinth-src/x-oniq/core/Configs.mjs');
 * 	return this.updateValue$({
 * 		neinthInstance,
 * 		mode: 'mostRecent',
 * 		derived: async () => {
 * 			const Configs = Configs_.value;
 * 			if (!Configs) {
 * 				return;
 * 			}
 * 			return new Configs({
 * 				sqlPath: 'sqls',
 * 				frontendMjs: 'dev/frontend/js/type.mjs',
 * 				backendBasePath: 'backend/sqlMap',
 * 				inputFieldStartsWith: ':',
 * 				async loopHandler() {},
 * 				async postLoopHandler() {},
 * 			});
 * 		},
 * 	});
 * });
 * export default neinthInstance;
 * ```
 * - try to create:
 * >- `sqls`
 * >>- `myQuery.sql`
 * ```sql
 * select a as b from myTable where id= :user_id
 * ```
 * >>- the `fieldName` of `input` and `output` have:
 * >>>- details: `detailName` of `input`/`output`, separated by underscore `_`;
 * >>>>- this is usefull if you want to use a pattern to handle the `fieldName` conditionally, like, `hashed_password`, or `be_apiKey` (as in backend only);
 * >>>- full: `fullName` of `input`/`output`;
 */
export class SQLInfos {
	/**
	 * @typedef {import('neinth').Infos} Info
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
	}
	/**
	 * @typedef {Object} sqlFieldsType
	 * @property {inputOutput[]} input
	 * @property {inputOutput[]} output
	 */
	/**
	 * @type {sqlFieldsType}
	 */
	get fields() {
		return { input: this.inputFields, output: this.outputFields };
	}

	/**
	 * @typedef {Object} sqlRelativePath
	 * @property {Object} path
	 * - details of `relativePath`;
	 * @property {Object} path.array
	 * - `relativePath` as `array`:
	 * @property {Array<string>} path.array.asc
	 * - `relativePath` as `array` asc;
	 * @property {Array<string>} path.array.desc
	 * - `relativePath` as `array` desc;
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
			path: { string: fullPath, array: { asc: pathArray, desc: [...pathArray].reverse() } },
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
	 * @typedef {Object} inputOutput
	 * @property {string} full
	 * - `fullName` of the `input`/`output`;
	 * @property {Object} details
	 * - `detailName` of the `input`/`output`, separated using `underscore` `_`;
	 * @property {string[]} details.asc
	 * - `detailName` with asc order;
	 * @property {string[]} details.desc
	 * - `detailName` with desc order;
	 */
	/**
	 * @private
	 * @param {string[]} fullStrings
	 * @returns {inputOutput[]}
	 */
	static generateInpuOutput = (fullStrings) => {
		const inputOutputs = [];
		for (let i = 0; i < fullStrings.length; i++) {
			const full = fullStrings[i];
			const asc = full.split('_');
			const desc = [...asc].reverse();
			inputOutputs.push({ full, details: { asc, desc } });
		}
		return inputOutputs;
	};
	/**
	 * @private
	 * @type {inputOutput[]}
	 */
	get outputFields() {
		return SQLInfos.generateInpuOutput(SQLInfos.toUnqoute(SQLInfos.getOutputFields(this.content)));
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
	 * @type {inputOutput[]}
	 */
	get inputFields() {
		return SQLInfos.generateInpuOutput(
			SQLInfos.getInputFields(this.content, this.configInstance.inputFieldStartsWith)
		);
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

export default new NeinthComponent(async () => {
	return SQLInfos;
});
