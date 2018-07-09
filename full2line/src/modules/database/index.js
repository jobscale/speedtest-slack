import { Util as u } from '@/modules/util';
import { Database as Base } from '@/modules/common/database';

export default class Database extends Base {
  constructor(instance) {
    super(instance);
    u.logger.log('Database start.');
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
