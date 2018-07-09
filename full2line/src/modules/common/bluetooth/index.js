const { Util } = require('@/modules/util');

const Bluetooth = function _() {
  this.constructor = () => {
    Util.logger.info('New Instance of Bluetooth');
  };
  this.constructor();
};

module.exports = {
  Bluetooth,
};
