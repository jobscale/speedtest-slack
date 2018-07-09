const { Util } = require('@/modules/util');

const Storage = function _() {
  this.constructor = () => {
    Util.logger.info('New Instance of Storage');
  };
  this.constructor();
};

module.exports = {
  Storage,
};
