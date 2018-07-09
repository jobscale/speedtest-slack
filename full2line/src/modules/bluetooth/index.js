import { Util as u } from '@/modules/util';
import { Bluetooth as Base } from '@/modules/common/bluetooth';

export default class Bluetooth extends Base {
  constructor() {
    super();
    u.logger.log('Bluetooth start.');
  }
}
