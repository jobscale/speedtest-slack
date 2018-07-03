/* eslint-disable no-unused-vars */
const lang = require('@/resources/strings');
/* eslint-enable no-unused-vars */

module.exports = {
  logging(...argv) {
    window.console.log(...argv);
  },
  translate(source) {
    /* eslint-disable no-eval */
    return eval(`lang.${source}`);
    /* eslint-enable no-eval */
  },
};
