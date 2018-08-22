import { Util as u } from '@/modules/util';
import { Constant } from '@/modules/common';

export const Mock = {
  assign(blue) {
    u.merge(blue, this);
  },
  getPower() {
    return this.status.power ? this.status.power-- : this.status.power = 5;
  },
  scan() {
    const promise = u.promise();
    const data = [
      {
        name: 'first interface',
        id: '12-34-56-78',
      },
      {
        name: 'second interface',
        id: '34-56-78-12',
      },
      {
        name: 'third interface',
        id: '56-78-12-34',
      },
    ];
    const cb = () => {
      this.status.devices.push(data.shift());
      if (data.length) {
        setTimeout(cb, 1000);
      }
    };
    setTimeout(cb, 1000);
    setTimeout(() => promise.resolve(this.status.devices), Constant.blue.scanSeconds * 1000);
    this.status.devices.length = 0;
    return promise.instance;
  },
  connect(device) {
    const promise = u.promise();
    const cb = () => {
      this.status.active = true;
      this.status.level = 1;
      this.status.device = device;
      this.status.power = 5;
      promise.resolve('ok');
    };
    setTimeout(cb, 1200000);
    this.changeMode();

    return promise.instance;
  },
  disconnect() {
    const promise = u.promise();
    const cb = () => {
      this.status.active = false;
      this.status.level = 0;
      this.status.power = -1;
      promise.resolve('ok');
    };
    setTimeout(cb, 200);
    return promise.instance;
  },
  findingSensor() {
    this.promiseindingSensor = u.promise();
    const cb = () => {
      const sensor = {
        id: '11-22-33-44-55-66',
        status: 'found',
      };
      this.promiseindingSensor.resolve(sensor);
    };
    setTimeout(cb, 5000);
    return this.promiseindingSensor.instance;
  },
  cancelFindingSensor() {
    const sensor = {
      status: 'canceled',
    };
    this.promiseindingSensor.resolve(sensor);
  },
  // 設定モード移行
  changeMode() {
    u.logger.info('run changeMode');
    const p = u.promise();
    // ボタン押下状態
    const cb = () => {
      u.logger.info(this.makeCommandGetSendSwitchState());
      this.makeCommandGetSendSwitchState()
      .then(res => {
        if (res[0] === 0x01) {
          u.logger.info('pushed button');
          p.resolve('pushed button');
        } else {
          setTimeout(cb, 1000);
        }
      });
    };
    setTimeout(cb, 1000);
    p.instance
    .then(() => this.makeCommandTransSettingMode())       // 設定モード移行
    // 無線CPU状態確認
    .then(() => this.makeCommandConfirmDimmingSensorId()) // AセンサID確認
    .then(() => this.makeCommandconfirmWirelessChannel()) // 無線CH確認
    // 無線ペアリング設定確認
    // 調光回路ID確認
    // ペアリング情報
    .then(() => this.makeCommandSettingWirelessChannel()) // 無線CH設定
    // フル２線アドレス確認
    // 一定値照度制御設定
    // ホップ設定確認
    .catch(e => u.logger.error(e.message));
  },

  // 調光AセンサIDデータ確認
  makeCommandConfirmDimmingSensorId() {
    u.logger.info('run makeCommandConfirmDimmingSensorId');
    const promise = u.promise();
    const cb = () => {
      const data = [0x01, 0x01, 0x01, 0xFF];
      promise.resolve(data);
    };
    setTimeout(cb, 200);
    return promise.instance;
  },

  // 無線CH確認
  makeCommandconfirmWirelessChannel() {
    u.logger.info('run makeCommandconfirmWirelessChannel');
    const promise = u.promise();
    const cb = () => {
      const data = [0xFF];
      promise.resolve(data);
    };
    setTimeout(cb, 200);
    return promise.instance;
  },

  // 無線CH設定
  makeCommandSettingWirelessChannel() {
    u.logger.info('run makeCommandSettingWirelessChannel');
    const promise = u.promise();
    const cb = () => {
      const data = [0x01];
      promise.resolve(data);
    };
    setTimeout(cb, 200);
    return promise.instance;
  },

  // 送信SW押下状態取得
  makeCommandGetSendSwitchState() {
    u.logger.info('run makeCommandGetSendSwitchState');
    const promise = u.promise();
    const cb = () => {
      const data = [0x01];
      promise.resolve(data);
    };
    setTimeout(cb, 200);
    return promise.instance;
  },

  // 設定モード移行（赤外線送信設定）
  makeCommandTransSettingMode() {
    u.logger.info('run makeCommandTransSettingMode');
    const promise = u.promise();
    const cb = () => {
      const data = [0x00];
      promise.resolve(data);
    };
    setTimeout(cb, 200);
    return promise.instance;
  },

  // 設定モード解除（赤外線解除設定）
  makeCommandEndSettingMode() {
    u.logger.info('run makeCommandEndSettingMode');
    const promise = u.promise();
    const cb = () => {
      const data = [0x00];
      promise.resolve(data);
    };
    setTimeout(cb, 200);
    return promise.instance;
  },
};
export default {
  Mock,
};
