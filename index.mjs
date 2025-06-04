// @ts-check
/**
 * generated using:
 * @see {@link https://www.npmjs.com/package/@html_first/js_lib_template | @html_first/js_lib_template}
 * @copyright
 * 
 * @description
 * ## x-oniq
 * - pronounced as `exonic`;
 * - meant to be `[X]sonic[Query]`;
 * - it is build to be run on top of `neinth` as `neinth-script`;
 * - it is:
 * >- SQL `parser`;
 * >>- mainly to parse `rawSQL` file into `inputFields` and `outputFields`;
 * >- run on top of `neinth`;
 * >>- no need of intricate `scripts` on your `package.json`, you can just
 * ```shell
 * npx neinth
 * ```
 * >>- and all will be handled by `neinth` runtime script;
 * 
 * ## package management
 * >- example are using `npm` and `npx`, you can technically use anything that compatible for them(eg. `bun` and `bunx`);
 * 
 * >- installation:
 * ```shell
 * npm i x-oniq
 * npx neinth-package -p x-oniq -i
 * ```
 * >- to update:
 * ```shell
 * npm i x-oniq
 * npx neinth-package -p x-oniq
 * ```
 * >- watch out for the `i` flag, it is a fresh install for all `neinth-src/x-oniq`, including your `config`;
 * 
 * ## how it works
 * - the parser is just regex matcher to simple rulling;
 * >- if you find oncovered edge cases that it should be an input or output field yet it is not detected, or over detected, you can report it as a bug;
 * - we don't typesafe your raw SQL, you can use more dedicated typesafe sql writer(eg. [HeidiSQL](http://heidisql.com/), or your favourite software) to write them;
 * - it is works on top of [neinth](https://www.npmjs.com/package/neinth);
 * >- meaning, you get `neinth` access for managing `script` generation on the fly using `writeFile`, fully managed by `neinth` each time the necessary `neinth-src/**/*` changes;
 * 
 */
export { Configs } from './neinth-src/x-oniq/core/Configs.mjs';
export { SQLInfos } from './neinth-src/x-oniq/core/SQLInfos.mjs';