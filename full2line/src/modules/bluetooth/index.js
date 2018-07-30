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
      this.mock = new Mock(this);
      setInterval(() => this.status.power === -1 ? undefined : this.getPower(), 3000);
    }
  }
  getPower() {
    if (!this.hasBLE) {
      this.mock.getPower();
    }
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
  connect(param) {
    const promise = u.promise();
    if (!this.hasBLE) {
      this.mock.connect(param)
      .then(res => promise.resolve(res));
    }
    return promise.instance;
  }
  disconnect() {
    const promise = u.promise();
    if (!this.hasBLE) {
      this.mock.disconnect()
      .then(res => promise.resolve(res));
    }
    return promise.instance;
  }
}
export default {
  Bluetooth,
};
