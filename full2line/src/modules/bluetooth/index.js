import { Util as u } from '@/modules/util';
import { Bluetooth as Base } from '@/modules/common/bluetooth';

export class Bluetooth extends Base {
  constructor() {
    super();
    u.logger.info('start', 'Bluetooth');
    this.status = {
      power: 5,
    };
  }
  initialize() {
    setInterval(() => this.status.power ? this.status.power-- : this.status.power = 5, 3000);
  }
}
export default {
  Bluetooth,
};
