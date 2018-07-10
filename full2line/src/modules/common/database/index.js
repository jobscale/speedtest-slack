/**
 * 変数名ルール
 * cb コールバック
 * ecb エラーコールバック
 * tx トランザクション
 * dt DateTime
 */

const { Util } = require('@/modules/util');

const Database = function _() {
  this.constructor = () => {
    Util.logger.log('New Instance of Database');
    this.info = {};
    this.initialize();
  };
  /**
   * 初期化
   */
  this.initialize = () => {
    this.info.ua = navigator.userAgent.toLowerCase();
    this.info.isNative = this.info.ua.match('android') || this.info.ua.match('iphone');
  };
  /**
   * オープン
   * @param name
   * @returns {*}
   */
  this.open = name => {
    this.info.name = name;
    this.info.location = 'default';
    this.info.description = 'Web SQL Database';
    this.info.size = 5 * 1024 * 1024;
    this.info.version = '1.0';
    this.info.module = window.sqlitePlugin ? 'SQLite' : 'WebSQL';
    return this[`open${this.info.module}`]();
  };
  /**
   * クローズ
   * @returns {*}
   */
  this.close = () => this.database ? (() => {
    this.database.close(this.cbSuccess);
    delete this.database;
  })() : null;
  /**
   * SQLite
   */
  this.openSQLite = () => {
    Util.logger.info(`call to openSQLite. ${this.info.name}`);
    const promise = this.promise();
    this.database = window.sqlitePlugin.openDatabase(this.info, (...argv) => {
      this.cbSuccess(...argv);
      promise.resolve(...argv);
    }, (e) => {
      this.cbError(e);
      promise.reject(e);
    });
    return promise.instance;
  };
  /**
   * WebSQL
   */
  this.openWebSQL = () => {
    Util.logger.info(`call to openWebSQL. ${this.info.name}`);
    const promise = this.promise();
    this.database = window.openDatabase(
      this.info.name, this.info.version, this.info.description, this.info.size,
    );
    promise.resolve(this.info);
    return promise.instance;
  };
  /**
   * クエリを実行
   * @param sql
   * @returns {*|PromiseLike<T>|Promise<T>}
   */
  this.exec = sql => {
    let result;
    return this.transaction(tx => {
      tx.executeSql(sql, [], (_tx, res) => result = res, this.cbError);
    })
    .then(() => result);
  };
  /**
   * 異常終了のコールバック
   */
  this.cbError = e => Util.logger.error('error.', e.message);
  /**
   * 正常終了のコールバック
   */
  this.cbSuccess = (...argv) => typeof argv[0] === 'function' ? (() => {
    Util.logger.info('succeeded.');
    const method = argv.unshift();
    method(...argv);
  })() : null;
  this.transaction = (exec) => {
    const promise = this.promise();
    this.database.transaction(exec, e => {
      this.cbError(e);
      promise.reject(e);
    }, (...argv) => {
      this.cbSuccess(...argv);
      promise.resolve(...argv);
    });
    return promise.instance;
  };
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
  this.select = (name, columns, where, order, data, cb, ecb) => {
    let sql = `SELECT ${columns} FROM ${name} WHERE delete_at IS NULL`;
    if (where) sql += ` AND ${where}`;
    if (order) sql += ` ORDER BY ${order}`;
    return this.transaction(tx => {
      tx.executeSql(sql, data, (_tx, res) => cb(res), (_tx, e) => ecb(e));
    });
  };
  /**
   * 挿入
   * @param name
   * @param columns
   * @param values
   * @param data
   * @returns {*}
   */
  this.insert = (name, columns, values, data) => {
    const sql = `INSERT INTO ${name} (${columns}) VALUES (${values})`;
    return this.transaction(tx => {
      tx.executeSql(sql, data);
    });
  };
  /**
   * 更新
   * @param name
   * @param id
   * @param columns
   * @param data
   * @returns {*}
   */
  this.update = (name, id, columns, data) => {
    data.push(Util.dateToString(new Date()));
    data.push(id);
    const sql = `UPDATE ${name} SET ${columns}, update_at = ? WHERE id = ?`;
    return this.transaction(tx => {
      tx.executeSql(sql, data);
    });
  };
  /**
   * 論理削除
   * @param name
   * @param id
   * @returns {*}
   */
  this.delete = (name, id) => {
    const sql = `UPDATE ${name} SET delete_at = ? WHERE id = ?`;
    const data = [
      Util.dateToString(new Date()),
      id,
    ];
    return this.transaction(tx => {
      tx.executeSql(sql, data);
    });
  };
  this.organizeTarget = (name, dt) => {
    const promise = this.promise();
    const sql = `SELECT * FROM ${name} WHERE create_at < ?`;
    const data = [
      Util.dateToString(dt),
    ];
    this.transaction(tx => {
      tx.executeSql(sql, data, (_tx, res) => promise.resolve(res), (_tx, e) => promise.reject(e));
    });
    return promise.instance;
  };
  this.constructor();
};

module.exports = {
  Database,
};
