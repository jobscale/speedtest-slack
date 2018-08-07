import { Util as u } from '@/modules/util';
import { Bluetooth as Base } from '@/modules/common/bluetooth';
import { Constant } from '@/base/common';
import { Mock } from './mock';

export class Bluetooth extends Base {
  constructor() {
    super();
    u.logger.info('start', 'Bluetooth', this.hasBLE);
    this.status = {
      active: false,
      power: -1,
      devices: [],
      device: null,
    };
    this.responseData = [];
    this.conbineData = null;
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
    .catch(e => {
      u.logger.error('error', e.message);
      throw e;
    });
  }
  connect(device) {
    return super.connect(device)
    .then(res => {
      this.indicate();
      u.logger.info(res);
    })
    .catch(e => u.logger.error(e.message));
  }
  disconnect() {
    return super.disconnect()
    .then(res => u.logger.info(res))
    .catch(e => u.logger.error(e.message));
  }

  // データを作成する処理
  writeData(closure) {
    const data = null;
    // 各種データを作成する
    super.writeWithBle(data, closure)
    .then(res => u.logger.info(res))
    .catch(e => u.logger.error(e.message));
  }

  indicate() {
    return super.indicate()
    .then(res => u.logger.info(res))
    .catch(e => u.logger.error(e.message));
  }
}
export default {
  Bluetooth,
};
