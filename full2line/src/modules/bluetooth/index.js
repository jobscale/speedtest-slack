import { Util as u } from '@/modules/util';
import { Bluetooth as Base } from '@/modules/common/bluetooth';

export class Bluetooth extends Base {
  constructor() {
    super();
    u.logger.info('start', 'Bluetooth');
    this.status = {
      active: false,
      power: -1,
    };
  }
  initialize() {
    setInterval(() => this.status.power === -1 ? undefined : this.getPower(), 3000);
  }
  getPower() {
    // TODO: mock stub
    return this.status.power ? this.status.power-- : this.status.power = 5;
  }
  connect(param) {
    const promise = u.promise();
    const cb = () => { // TODO: mock stub
      u.merge(this.status, param);
      this.status.active = true;
      this.status.power = 5;
      promise.resolve('ok');
    };
    setTimeout(cb.bind(this), 200);
    return promise.instance;
  }
  disconnect() {
    const promise = u.promise();
    const cb = () => { // TODO: mock stub
      this.status.active = false;
      this.status.power = -1;
      promise.resolve('ok');
    };
    setTimeout(cb.bind(this), 200);
    return promise.instance;
  }
}
export default {
  Bluetooth,
};
