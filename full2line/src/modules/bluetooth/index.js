import { Util as u } from '@/modules/util';
import { Bluetooth as BluetoothBase } from '@/modules/common/bluetooth';

export default class Bluetooth extends BluetoothBase {
  constructor() {
    super();
    u.logger.log('Bluetooth start.');
  }
}
