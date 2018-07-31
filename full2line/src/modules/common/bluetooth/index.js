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

  scan() {
    const promise = u.promise();
    const seconds = 10;

    if (this.ble) {
      setTimeout(() => promise.resolve(this.devices), seconds * 1000);
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
    } else {
      u.logger.info('no plugin scan stub!!');
      promise.resolve(this.devices);
    }
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
