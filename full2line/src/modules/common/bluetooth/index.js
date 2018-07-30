import { Util as u } from '@/modules/util';

export class Bluetooth {
  constructor() {
    u.logger.info('New Instance of Bluetooth');
    this.eventHandler = {};
    this.enable()
    .then(res => this.hasBLE = res);
  }
  enable() {
    const promise = u.promise();
    if (window.ble) {
      window.ble.enable(
      () => promise.resolve(true),
      () => promise.resolve(false),
      );
    } else {
      promise.resolve(false);
    }
    return promise.instance;
  }
  on(event, callback) {
    this.eventHandler[event] = callback;
  }

  scan() {
    this.devices = [];
    this.ble.scan([this.scanUuid], 10, (device) => {
      u.logger.info(`scan success name:${device.name} id:${device.id} rssi:${device.rssi}`);
      // 異常値排除
      if (device.rssi === 127) {
        return;
      }
      // 重複排除
      this.devices.forEach((scanDevice) => {
        if (scanDevice.id === device.id) {
          // return;
        }
      });
      this.devices.push(device);
      // 降順にソート
      this.devices.sort((a, b) => {
        if (a.rssi > b.rssi) return -1;
        if (a.rssi < b.rssi) return 1;
        return 0;
      });
    }, (reason) => {
      u.logger.info(`scan failure reason:${reason}`);
    });
  }

  connect() {

  }

  disconnect() {

  }

  write() {

  }
}
export default {
  Bluetooth,
};
