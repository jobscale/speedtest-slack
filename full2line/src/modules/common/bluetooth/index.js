import { Util as u } from '@/modules/util';
import { Constant } from '@/modules/common';

export class Bluetooth {
  constructor() {
    u.logger.info('New Instance of Bluetooth');
    this.ble = window.ble;
    this.eventHandler = {};
    this.indicateHandler = null;
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
  fire(name, event) {
    u.logger.info(name, event);
    if (!this.eventHandler[name]) {
      return;
    }
    setTimeout(() => this.eventHandler[name](event), 0);
  }
  scan(devices, seconds) {
    const promise = u.promise();
    setTimeout(() => promise.resolve(devices), seconds * 1000);
    this.ble.scan([Constant.blue.scanUuid], seconds, device => {
      u.logger.info(`scan success name:${device.name} id:${device.id} rssi:${device.rssi}`);
      // 異常値排除
      if (device.rssi === 127) {
        return;
      }
      // 未登録を追加
      if (!u.find(devices, { id: device.id })) devices.push(device);
    }, reason => promise.reject(new Error(`scan failure reason:${reason}`)));
    return promise.instance;
  }
  connect(device) {
    const promise = u.promise();
    this.ble.connect(device.id, () => {
      u.logger.info('connect Success');
      promise.resolve(device);
      this.status.active = true;
      this.status.level = 1;
      this.status.device = device;
    }, reason => {
      u.logger.log('Connect lost');
      this.indicateHandler = undefined;
      this.status.active = false;
      this.status.level = 0;
      this.fire('disconnect');
      promise.reject(new Error(`connect failure reason:${reason}`));
    });
    return promise.instance;
  }
  disconnect() {
    const promise = u.promise();
    this.ble.disconnect(this.status.device.id, () => {
      u.logger.info('disConnect Succees');
      promise.resolve();
      this.indicateHandler = undefined;
      this.status.active = false;
      this.status.level = 0;
    }, reason => promise.reject(new Error(`disconnect failure reason:${reason}`)));
    return promise.instance;
  }
  write(data) {
    const promise = u.promise();
    u.logger.log(`writeData:${data}`);
    const writeData = this.createCommandData(data);
    this.ble.isConnected(this.status.device.id, () => {
      this.ble.write(this.status.device.id, Constant.blue.serviceUuid,
        Constant.blue.writeCharacteristicUuid, writeData, (rawData) => {
          u.logger.log('write Success');
          promise.resolve(rawData);
        }, reason => {
          u.logger.log('write failure');
          promise.reject(new Error(`write failure reason:${reason}`));
        });
    }, () => {
      u.logger.log('isConnected failure');
    });
    return promise.instance;
  }
  async writeWithBle(data) {
    // 先にエスケープ処理、デリミタを付与してから分割する
    const promise = u.promise();
    if (this.indicateHandler) {
      promise.reject(new Error('ERROR: busy.'));
    }
    this.indicateHandler = recvData => {
      promise.resolve(recvData);
    };
    const writeData = u.chunk(this.addDelimiter(this.sendEscape(data)), Constant.bleDataSize);
    for (let p = 0; p < writeData.length; p++) {
      await this.write(writeData[p]);
    }
    return promise.instance;
  }
  indicate() {
    const finishIndicate = () => {
      const receiveData = this.receiveEscape(this.divideDelimiter(this.combineData));
      this.indicateHandler(receiveData);
      this.indicateHandler = undefined;
    };
    const startNotification = id => {
      this.ble.startNotification(id, Constant.blue.serviceUuid,
      Constant.blue.indicateCharacteristicUuid, rawData => {
        u.logger.log('Notification Success');
        this.responseData = [];
        this.combineData = this.combine(rawData);
        if (this.combineData[this.combineData.length - 1] === 0x7E) {
          finishIndicate();
        }
      }, reason => {
        u.logger.log(`Notification failure reason:${reason}`);
      });
    };
    this.ble.isConnected(this.status.device.id, () => {
      u.logger.log('Connect Success');
      startNotification(this.status.device.id);
    }, () => {
      u.logger.log('Connect failed');
    });
  }
  // 受信したデータを変換して結合する処理
  combine(data) {
    const data1 = new Uint8Array(data);
    // const dataView = new DataView(buffer);
    for (let p = 0; p < data1.byteLength; p++) {
      u.logger.log(`Combine :${data1[p]}`);
      this.responseData.push(data1[p]);
    }
    return this.responseData;
  }
  // 送信時のエスケープ処理
  sendEscape(data) {
    const array = [];
    let pos = 0;
    for (let p = 0; p < data.length; p++) {
      if (data[p] === 0x7E) {
        array[pos] = 0x7D;
        array[pos + 1] = 0x5E;
        pos += 2;
      } else if (data[p] === 0x7D) {
        array[pos] = 0x7D;
        array[pos + 1] = 0x5D;
        pos += 2;
      } else {
        array[pos] = data[p];
        pos++;
      }
    }
    return array;
  }
  // 受信時のエスケープ処理
  receiveEscape(data) {
    let array = [];
    let pos = 0;
    for (let p = 0; p < data.length; p++) {
      // 0x7Dが出た場合は次のデータも確認する
      if (data[p] === 0x7D) {
        p++;
        if (data[p] === 0x5E) {
          array[pos] = 0x7E;
          pos++;
        } else if (data[p] === 0x5D) {
          array[pos] = 0x7D;
          pos++;
        } else {
          // エラー扱いなのでひとまず初期化した配列を返すようにしておく
          return array = [];
        }
      } else {
        array[pos] = data[p];
        pos++;
      }
    }
    return array;
  }
  // デリミタ付与処理
  addDelimiter(data) {
    // デリミタ分の2バイトを追加しておく
    const length = data.length + 2;
    const array = new Array(length);
    let pos = 0;
    for (let p = 0; p < length; p++) {
      if (p === 0 || p === length - 1) {
        array[p] = 0x7E;
      } else {
        array[p] = data[pos];
        pos++;
      }
    }
    return array;
  }
  // デリミタによる分割処理
  // デリミタを削除し、データ毎に配列で分けて返す
  divideDelimiterArray(data) {
    const dataSet = []; // デリミタ毎で分割したデータ配列を格納する
    let binaryDataArray = []; // デリミタで挟まれているデータ列を入れる
    let isEndFrame = false;
    for (let p = 0; p < data.length; p++) {
      if (data[p] === 0x7E) {
        if (isEndFrame) {
          dataSet.push(binaryDataArray);
          binaryDataArray = []; // 次のbinaryArray初期化
          isEndFrame = false;
        }
      } else {
        binaryDataArray.push(data[p]);
        isEndFrame = true;
      }
    }
    return dataSet;
  }
  // デリミタを削除する処理
  divideDelimiter(data) {
    const dataSet = data.slice();
    u.logger.log(`recv :${dataSet}`);
    dataSet.shift();
    dataSet.pop();
    return dataSet;
  }
  // 送信データ列を作成して返す
  createCommandData(data) {
    const buffer = new ArrayBuffer(data.length);
    const dataView = new DataView(buffer);
    for (let p = 0; p < dataView.byteLength; p++) {
      dataView.setUint8(p, data[p]);
    }
    const sendData = buffer;
    return sendData;
  }
  // 3バイト目までを破棄し、4バイト目以降のデータ部分を返す
  getQueryData(recv) {
    u.logger.log(`recv :${recv.length}`);
    const data = recv.slice();
    for (let p = 0; p < 3; p++) {
      data.shift();
    }
    return data;
  }
  // 設定データをセット
  setQueryDataForArray(adrs, query) {
    const data = adrs.slice();
    return data.concat(query);
  }
  // テスト用コード
  commandTestCode() {
    const sendArray = [0x01, 0x02, 0x03, 0x04, 0x7E, 0x06, 0x07, 0x7D, 0x09, 0x0A];
    u.logger.log(sendArray);
    const escapedArray = this.sendEscape(sendArray);
    u.logger.log(escapedArray);
    const addDelimitedArray = this.addDelimiter(escapedArray);
    u.logger.log(addDelimitedArray);
    const commandDataArray = this.createCommandData(addDelimitedArray);
    u.logger.log(commandDataArray);
    const receiveArray = [0x7E, 0x01, 0x02, 0x7D, 0x5D, 0x03, 0x04, 0x7E,
      0x7E, 0x05, 0x06, 0x7D, 0x5E, 0x08, 0x09, 0x7E];
    u.logger.log(receiveArray);
    const derimiterArray = this.divideDelimiterArray(receiveArray);
    u.logger.log(derimiterArray);
    const escapeArray1 = this.receiveEscape(derimiterArray[0]);
    const escapeArray2 = this.receiveEscape(derimiterArray[1]);
    u.logger.log(escapeArray1);
    u.logger.log(escapeArray2);
  }
}
export default {
  Bluetooth,
};
