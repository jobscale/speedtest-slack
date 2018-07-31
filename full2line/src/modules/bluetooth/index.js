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
      Mock.assign(this);
      setInterval(() => this.status.power === -1 ? undefined : this.getPower(), 3000);
    }
  }
  getPower() {
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
