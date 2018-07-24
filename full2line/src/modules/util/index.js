import _ from 'lodash';

const craft = {
  /* eslint-disable global-require */
  lang: require('@/resources/strings'), /* eslint-enable global-require */
  logger: (methods => {
    const nativeCode = () => {};
    const self = {};
    methods.forEach((method) => {
      self[method] = process.env.NODE_ENV === 'production' ? nativeCode : window.console[method];
      window.console[method] = nativeCode;
    });
    return self;
  })(['log', 'info', 'warn', 'error', 'assert']),
};

export class Util {
  constructor() {
    throw Error('only static');
  }
  static get key() {
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
  }
  static translate(source) {
    /* eslint-disable no-eval */
    return eval(`Util.lang.${source}`); /* eslint-enable no-eval */
  }
  static stringToDatetime(timestamp) {
    return new Date(timestamp);
  }
  static dateToString(ts) {
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
  }
  static promise() {
    const promise = {};
    promise.instance = new Promise((resolve, reject) => {
      promise.resolve = resolve;
      promise.reject = reject;
    });
    return promise;
  }
}
_.merge(Util, craft, _);
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
