const _ = require('lodash');

const Util = _.merge({
  /* eslint-disable global-require */
  lang: require('@/resources/strings'), /* eslint-enable global-require */
  /* eslint-disable no-eval */
  translate: source => eval(`Util.lang.${source}`), /* eslint-enable no-eval */
  logger: (methods => {
    const self = {};
    methods.forEach((method) => {
      self[method] = window.console[(['log', 'info'].indexOf(method) !== -1) ? 'warn' : method];
      if (process.env.NODE_ENV === 'production') {
        window.console[method] = () => {};
      }
    });
    return self;
  })(['log', 'info', 'warn', 'error', 'assert']),
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
}, _);

const mixin = {
  data() {
    return {
      translate: Util.translate,
    };
  },
};

module.exports = {
  Util,
  mixin,
};
