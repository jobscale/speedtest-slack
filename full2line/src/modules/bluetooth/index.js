import { Util as u } from '@/modules/util';
import { Bluetooth as Base } from '@/modules/common/bluetooth';

class Mock {
  constructor(blue) {
    this.blue = blue;
  }
  getPower() {
    return this.blue.status.power ? this.blue.status.power-- : this.blue.status.power = 5;
  }
  connect(param) {
    const promise = u.promise();
    const cb = () => {
      u.merge(this.blue.status, param);
      this.blue.status.active = true;
      this.blue.status.power = 5;
      promise.resolve('ok');
    };
    setTimeout(cb.bind(this), 200);
    return promise.instance;
  }
  disconnect() {
    const promise = u.promise();
    const cb = () => {
      this.blue.status.active = false;
      this.blue.status.power = -1;
      promise.resolve('ok');
    };
    setTimeout(cb.bind(this), 200);
    return promise.instance;
  }
}

export class Bluetooth extends Base {
  constructor() {
    super();
    u.logger.info('start', 'Bluetooth');
    this.hasBLE = !!window.bluetoothle;
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
