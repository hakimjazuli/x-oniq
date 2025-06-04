## x-oniq
- pronounced as `exonic`;
- meant to be `[X]sonic[Query]`;
- it is build to be run on top of `neinth` as `neinth-script`;
- it is:
>- SQL `parser`;
>>- mainly to parse `rawSQL` file into `inputFields` and `outputFields`;
>- run on top of `neinth`;
>>- no need of intricate `scripts` on your `package.json`, you can just
```shell
npx neinth
```
>>- and all will be handled by `neinth` runtime script;

## package management
>- example are using `npm` and `npx`, you can technically use anything that compatible for them(eg. `bun` and `bunx`);

>- installation:
```shell
npm i x-oniq
npx neinth-package -p x-oniq -i
```
>- to update:
```shell
npm i x-oniq
npx neinth-package -p x-oniq
```
>- watch out for the `i` flag, it is a fresh install for all `neinth-src/x-oniq`, including your `config`;

## how it works
- the parser is just regex matcher to simple rulling;
>- if you find oncovered edge cases that it should be an input or output field yet it is not detected, or over detected, you can report it as a bug;
- we don't typesafe your raw SQL, you can use more dedicated typesafe sql writer(eg. [HeidiSQL](http://heidisql.com/), or your favourite software) to write them;
- it is works on top of [neinth](https://www.npmjs.com/package/neinth);
>- meaning, you get `neinth` access for managing `script` generation on the fly using `writeFile`, fully managed by `neinth` each time the necessary `neinth-src/**/*` changes;

## documentation-list
- [Configs](#configs)
- [SQLInfos](#sqlinfos)
<h2 id="configs">Configs</h2>

- main config file, to be loaded and instantiated on your `config`

*) <sub>[go to exported list](#documentation-list)</sub>

<h2 id="sqlinfos">SQLInfos</h2>

- class definition for parser and collections of the sole data truth to be handled via `Configs` `handlers`:>- `param0.loopHandler`, and;>- `param0.postLoopHandler`;- example on how `config/configs.mjs` looks like:```js// @ts-checkimport { neinth } from 'neinth';/** * this is an neinth-script example */export default new neinth(async ({ importNeinth, writeFile }) => {	const configs = importNeinth('neinth-src/x-oniq/core/Configs.mjs').value;	if (!configs) {		return;	}	return new configs({		sqlPath: 'sqls',		frontendMjs: 'dev/frontend/js/type.mjs',		backendBasePath: 'backend/sqlMap',		inputFieldStartsWith: ':',		async loopHandler(sqlInfos) {			// all configs option arguments are passed to sqlInfos.sqlInfos.configInstance;			// writeFile({ ...options });			return sqlInfos.fields;		},		async postLoopHandler(set_) {			console.dir({ fields: set_ }, { depth: null });			// writeFile({ ...options });		},	});});```- try to create:>- `sqls`>>- `myQuery.sql````sqlselect a as b from myTable where id= :user_id```

*) <sub>[go to exported list](#documentation-list)</sub>
