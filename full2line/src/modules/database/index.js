import { Util as u } from '@/modules/util';
import { Database as Base } from '@/modules/common/database';
import { Models } from './models';

class Database extends Base {
  constructor(instance) {
    super(instance);
    u.logger.info('start', 'Database');
  }
  initialize() {
    this.open(Models.schema, Models.size);
    return this.createTable()
    .then(() => {
      u.logger.info('succeeded', 'createTable');
      return u.db.dropTable();
    })
    .then(() => {
      u.logger.info('succeeded', 'dropTable');
      return 'ok';
    })
    .catch(e => u.logger.error(e.message));
  }
  createTable() {
    return this.transaction(tx => {
      u.each(Models.tables, (table, name) => {
        u.logger.info(`try createTable. ${name}`);
        tx.executeSql(table.DDL);
      });
    });
  }
  dropTable() {
    return this.transaction(tx => {
      u.each(Models.tables, (table, name) => {
        const sql = `DROP TABLE IF EXISTS ${name}`;
        tx.executeSql(sql);
      });
    });
  }
  organize(name, dt) {
    return this.organizeTarget(name, dt)
    .then(async res => {
      const sql = `DELETE FROM ${name} WHERE create_at < ?`;
      const data = [
        u.dateToString(dt),
      ];
      await this.transaction(tx => {
        tx.executeSql(sql, data);
      });
      return res;
    });
  }
  promise() {
    const promise = {};
    promise.instance = new Promise((resolve, reject) => {
      promise.resolve = resolve;
      promise.reject = reject;
    });
    return promise;
  }
}

export default Database;
