/**
 * 変数名ルール
 * cb コールバック
 * ecb エラーコールバック
 * tx トランザクション
 * dt DateTime
 */
import { Util as u } from '@/modules/util';

export class Database {
  constructor() {
    u.logger.log('New Instance of Database');
    this.initInfo();
  }
  /**
   * 初期化
   */
  initInfo() {
    const ua = navigator.userAgent.toLowerCase();
    this.info = {
      ua,
      isNative: ua.match('android') || ua.match('iphone'),
      location: 'default',
      description: 'Web SQL Database',
      version: '1.0',
      module: window.sqlitePlugin ? 'SQLite' : 'WebSQL',
    };
  }
  /**
   * オープン
   */
  open(name, size) {
    this.info.name = name;
    this.info.size = size;
    return this[`open${this.info.module}`]();
  }
  /**
   * クローズ
   */
  close() {
    return this.database ? (() => {
      this.database.close(this.cbSuccess);
      delete this.database;
    })() : null;
  }
  /**
   * SQLite
   */
  openSQLite() {
    u.logger.info(`call to openSQLite. ${this.info.name}`);
    const promise = u.promise();
    this.database = window.sqlitePlugin.openDatabase(this.info, (...argv) => {
      this.cbSuccess(...argv);
      promise.resolve(...argv);
    }, (e) => {
      this.cbError(e);
      promise.reject(e);
    });
    return promise.instance;
  }
  /**
   * WebSQL
   */
  openWebSQL() {
    u.logger.info(`call to openWebSQL. ${this.info.name}`);
    const promise = u.promise();
    this.database = window.openDatabase(
      this.info.name, this.info.version, this.info.description, this.info.size,
    );
    promise.resolve(this.info);
    return promise.instance;
  }
  /**
   * クエリを実行
   */
  exec(sql) {
    let result;
    return this.transaction(tx => {
      tx.executeSql(sql, [], (_tx, res) => result = res, this.cbError);
    })
    .then(() => result);
  }
  /**
   * 異常終了のコールバック
   */
  cbError(e) {
    u.logger.error('error.', e.message);
  }
  /**
   * 正常終了のコールバック
   */
  cbSuccess(...argv) {
    return typeof argv[0] === 'function' ? (() => {
      u.logger.info('succeeded.');
      const method = argv.unshift();
      method(...argv);
    })() : null;
  }
  /**
   * トランザクション
   * @param exec
   * @returns {Promise|i.a}
   */
  transaction(exec) {
    const promise = u.promise();
    this.database.transaction(exec, e => {
      this.cbError(e);
      promise.reject(e);
    }, (...argv) => {
      this.cbSuccess(...argv);
      promise.resolve(...argv);
    });
    return promise.instance;
  }
  /**
   * 選択
   * @param name
   * @param columns
   * @param where
   * @param order
   * @param data
   * @param cb
   * @param ecb
   * @returns {*}
   */
  select(name, columns, where, order, data, cb, ecb) {
    let sql = `SELECT ${columns} FROM ${name} WHERE delete_at IS NULL`;
    if (where) sql += ` AND ${where}`;
    if (order) sql += ` ORDER BY ${order}`;
    return this.transaction(tx => {
      tx.executeSql(sql, data, (_tx, res) => cb(res), (_tx, e) => ecb(e));
    });
  }
  /**
   * 挿入
   * @param name
   * @param columns
   * @param values
   * @param data
   * @returns {*}
   */
  insert(name, columns, values, data) {
    const sql = `INSERT INTO ${name} (${columns}) VALUES (${values})`;
    return this.transaction(tx => {
      tx.executeSql(sql, data);
    });
  }
  /**
   * 更新
   * @param name
   * @param id
   * @param columns
   * @param data
   * @returns {*}
   */
  update(name, id, columns, data) {
    data.push(u.dateToString(new Date()));
    data.push(id);
    const sql = `UPDATE ${name} SET ${columns}, update_at = ? WHERE id = ?`;
    return this.transaction(tx => {
      tx.executeSql(sql, data);
    });
  }
  /**
   * 論理削除
   * @param name
   * @param id
   * @returns {*}
   */
  delete(name, id) {
    const sql = `UPDATE ${name} SET delete_at = ? WHERE id = ?`;
    const data = [
      u.dateToString(new Date()),
      id,
    ];
    return this.transaction(tx => {
      tx.executeSql(sql, data);
    });
  }
  organizeTarget(name, dt) {
    const promise = u.promise();
    const sql = `SELECT * FROM ${name} WHERE create_at < ?`;
    const data = [
      u.dateToString(dt),
    ];
    this.transaction(tx => {
      tx.executeSql(sql, data, (_tx, res) => promise.resolve(res), (_tx, e) => promise.reject(e));
    });
    return promise.instance;
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
}
export default {
  Database,
};
