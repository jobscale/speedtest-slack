const _ = require('lodash');

const Util = _.merge({
  /* eslint-disable global-require */
  lang: require('@/resources/strings'),
  /* eslint-enable global-require */
  /* eslint-disable no-eval */
  translate: source => eval(`Util.lang.${source}`),
  /* eslint-enable no-eval */
  logger: (methods => {
    const self = {};
    methods.forEach((method) => {
      self[method] = window.console[method];
      if (process.env.NODE_ENV === 'production') {
        window.console[method] = () => {};
      }
    });
    return self;
  })(['log', 'info', 'warn', 'error', 'assert']),
}, _);

const mixin = {
  data() {
    return {
      translate: Util.translate,
    };
  },
  method: {
    logging: Util.logger.log,
  },
};

module.exports = {
  Util,
  mixin,
};
