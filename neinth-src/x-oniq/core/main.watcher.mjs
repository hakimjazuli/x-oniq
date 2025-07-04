// @ts-check

import { NeinthWatcher } from 'neinth';

export default new NeinthWatcher({
  relativePath: 'sqls',
  addDirToSet: false,
  addFileToSet: true,
  encoding: 'utf8',
});
