import { Util as u } from '@/modules/util';
import { Bluetooth as Base } from '@/modules/common/bluetooth';
import { Mock } from './mock';

export class Bluetooth extends Base {
  constructor() {
    super();
    u.logger.info('start', 'Bluetooth', this.hasBLE);
    this.status = {
      active: false,
      power: -1,
    };
  }
  initialize() {
    if (!this.hasBLE) {
      u.logger.warn('assign mock.');
      Mock.assign(this);
      setInterval(() => this.status.power === -1 ? undefined : this.getPower(), 3000);
    }
  }
  getPower() {
  }
  scan() {
    const promise = u.promise();
    if (this.hasBLE) {
      u.logger.info('run scan');
      super.scan()
        .then(devices => promise.resolve(devices));
    } else {
      this.mock.scan()
        .then(devices => promise.resolve(devices));
    }
    return promise.instance;
  }
  connect() {
    return super.connect()
    .then(res => u.logging.info(res))
    .catch(e => u.logging.error(e.message));
  }
  disconnect() {
    return super.disconnect()
    .then(res => u.logging.info(res))
    .catch(e => u.logging.error(e.message));
  }
}
export default {
  Bluetooth,
};
