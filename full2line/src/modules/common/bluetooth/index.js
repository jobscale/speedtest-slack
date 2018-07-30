import { Util as u } from '@/modules/util';

export class Bluetooth {
  constructor() {
    u.logger.info('New Instance of Bluetooth');
    this.enable()
    .then(res => this.hasBLE = res);
  }
  enable() {
    const promise = u.promise();
    if (window.ble) {
      window.ble.enable(
      () => promise.resolve(true),
      () => promise.resolve(false),
      );
    } else {
      promise.resolve(false);
    }
    return promise.instance;
  }
}
export default {
  Bluetooth,
};
