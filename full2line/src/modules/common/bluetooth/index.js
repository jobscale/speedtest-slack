import { Util as u } from '@/modules/util';

export class Bluetooth {
  constructor() {
    u.logger.info('New Instance of Bluetooth');
    this.ble = window.ble;
    this.eventHandler = {};
    this.enable()
    .then(res => this.hasBLE = res);
  }
  enable() {
    const promise = u.promise();
    if (this.ble) {
      this.ble.enable(
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
    const promise = u.promise();
    const seconds = 10;
    setTimeout(() => promise.resolve(), seconds * 1000);
    this.devices = [];
    this.ble.scan([this.scanUuid], seconds, (device) => {
      u.logger.info(`scan success name:${device.name} id:${device.id} rssi:${device.rssi}`);
      // 異常値排除
      if (device.rssi === 127) {
        return;
      }
      // 未登録を追加
      if (!u.find(this.devices, { id: device.id })) this.devices.push(device);
    }, (reason) => {
      u.logger.info(`scan failure reason:${reason}`);
    });
    return promise.instance;
  }

  connect() {
    const promise = u.promise();
    promise.resolve('connected');
    return promise.instance;
  }

  disconnect() {
    const promise = u.promise();
    promise.resolve('disconnected');
    return promise.instance;
  }

  write() {

  }
}
export default {
  Bluetooth,
};
