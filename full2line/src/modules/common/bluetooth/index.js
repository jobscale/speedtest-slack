import { Util as u } from '@/modules/util';

export class Bluetooth {
  constructor() {
    u.logger.info('New Instance of Bluetooth');
    this.ble = window.ble;
    this.eventHandler = {};
  }
  enable() {
    const promise = u.promise();
    if (this.ble) {
      this.ble.enable(
      () => promise.resolve(this.hasBLE = true),
      () => promise.resolve(this.hasBLE = false),
      );
    } else {
      promise.resolve(false);
    }
    return promise.instance;
  }
  on(event, callback) {
    this.eventHandler[event] = callback;
  }

  scan(devices, seconds) {
    const promise = u.promise();
    setTimeout(() => promise.resolve(devices), seconds * 1000);
    this.ble.scan([this.scanUuid], seconds, device => {
      u.logger.info(`scan success name:${device.name} id:${device.id} rssi:${device.rssi}`);
      // 異常値排除
      if (device.rssi === 127) {
        return;
      }
      // 未登録を追加
      if (!u.find(devices, { id: device.id })) devices.push(device);
    }, reason => promise.reject(`scan failure reason:${reason}`));
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
