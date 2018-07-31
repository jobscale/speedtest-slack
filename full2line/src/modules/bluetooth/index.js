import { Util as u } from '@/modules/util';
import { Bluetooth as Base } from '@/modules/common/bluetooth';
import { Constant } from '@/base/common';
import { Mock } from './mock';

export class Bluetooth extends Base {
  constructor() {
    super();
    u.logger.info('start', 'Bluetooth', this.hasBLE);
    this.scanUuid = 'ee5ffac6-eca7-46b4-99cf-eca4ad20e594';
    this.status = {
      active: false,
      power: -1,
      devices: [],
    };
  }
  initialize() {
    return this.enable()
    .then(res => {
      if (res) return;
      u.logger.warn('assign mock.');
      Mock.assign(this);
    })
    .then(() => {
      setInterval(() => this.status.active ? this.getPower() : undefined,
      Constant.blue.powerInterval);
    });
  }
  getPower() {
  }
  scan() {
    this.status.devices.length = 0;
    u.logger.info('run scan');
    return super.scan(this.status.devices, Constant.blue.scanSeconds)
    .then(devices => u.logger.assert(this.status.devices === devices))
    .catch(e => u.logger.error(e.message) || e);
  }
  connect() {
    return super.connect()
    .then(res => u.logger.info(res))
    .catch(e => u.logger.error(e.message));
  }
  disconnect() {
    return super.disconnect()
    .then(res => u.logger.info(res))
    .catch(e => u.logger.error(e.message));
  }
}
export default {
  Bluetooth,
};
