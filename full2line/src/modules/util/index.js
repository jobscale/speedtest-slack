import _ from 'lodash';

const dataset = document.querySelector('body').dataset;
export const Util = {
  get key() {
    const data = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const val = [];
    [8, 4, 4, 4, 12].forEach(len => {
      let x = '';
      for (let i = 0; i < len; i++) {
        x += data[Math.floor(Math.random() * data.length)];
      }
      val.push(x);
    });
    return val.join('-');
  },
  translate(source, params) {
    /* eslint-disable no-eval */
    let result = eval(`Util.lang.${source}`); /* eslint-enable no-eval */
    _.each(params, (value, key) => result = _.replace(result, `{{${key}}}`, value));
    return result;
  },
  stringToDatetime(timestamp) {
    return new Date(timestamp);
  },
  dateToString(ts) {
    const con = n => n < 10 ? `0${n}` : n;
    const dt = {
      Y: ts.getFullYear(),
      m: con(ts.getMonth() + 1),
      d: con(ts.getDate()),
      H: con(ts.getHours()),
      M: con(ts.getMinutes()),
      S: con(ts.getSeconds()),
    };
    return `${dt.Y}-${dt.m}-${dt.d} ${dt.H}:${dt.M}:${dt.S}`;
  },
  promise() {
    const promise = {};
    promise.instance = new Promise((resolve, reject) => {
      promise.resolve = resolve;
      promise.reject = reject;
    });
    return promise;
  },
  ui: {
    eventHandler: {},
    on(name, callback) {
      this.eventHandler[name] = callback;
    },
    fire(name, event) {
      Util.logger.info(name, event);
      if (!this.eventHandler[name]) {
        Util.logger.warn(`can not trigger ${name}`);
        return;
      }
      setTimeout(() => this.eventHandler[name](event), 0);
    },
  },
};
_.merge(Util, {
  /* eslint-disable global-require */
  lang: require('@/resources/strings'), /* eslint-enable global-require */
  logger: (methods => {
    const nativeCode = () => {};
    const self = {};
    methods.forEach((method) => {
      self[method] = dataset.logger ? window.console[method] : nativeCode;
      window.console[method] = nativeCode;
    });
    return self;
  })(['log', 'info', 'warn', 'error', 'assert']),
  ..._,
});
Util.logger.warn(Util.ui);
export const mixin = {
  data() {
    return {
      translate: Util.translate,
    };
  },
};
export default {
  Util,
  mixin,
};
