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
      level: 0,
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

  // 調光AセンサIDデータ確認
  makeCommandConfirmDimmingSensorId() {
    // 送信用データ作成
    const adrs = [0x02, 0x00, 0x3A];
    const data = [0x00]; // データIDが入る
    return super.writeWithBle(super.setQueryDataForArray(adrs, data))
    .then(recvData => {
      u.logger.info(`recvData :${recvData}`);
      return this.getQueryData(recvData);
    })
    .catch(e => u.logger.error(e.message));
  }

  // 無線CH確認
  makeCommandconfirmWirelessChannel() {
    // 送信用データ作成
    const adrs = [0x02, 0x00, 0x01];
    const data = [0x00]; // 無線CHが入る
    return super.writeWithBle(super.setQueryDataForArray(adrs, data))
    .then(recvData => {
      u.logger.info(`recvData :${recvData}`);
      return this.getQueryData(recvData);
    })
    .catch(e => u.logger.error(e.message));
  }

  // 無線CH設定
  makeCommandSettingWirelessChannel() {
    // 送信用データ作成
    const adrs = [0x02, 0x20, 0x01];
    const data = [0x00]; // 無線CHが入る
    return super.writeWithBle(super.setQueryDataForArray(adrs, data))
    .then(recvData => {
      u.logger.info(`recvData :${recvData}`);
      return this.getQueryData(recvData);
    })
    .catch(e => u.logger.error(e.message));
  }

  // 送信SW押下状態取得
  makeCommandGetSendSwitchState() {
    // 送信用データ作成
    const adrs = [0x01, 0x00, 0x02];
    const data = [0x00]; // 固定
    return super.writeWithBle(super.setQueryDataForArray(adrs, data))
    .then(recvData => {
      u.logger.info(`recvData :${recvData}`);
      return this.getQueryData(recvData);
    })
    .catch(e => u.logger.error(e.message));
  }

  // 設定モード移行（赤外線送信設定）
  makeCommandTransSettingMode() {
    // 送信用データ作成
    const adrs = [0x01, 0x20, 0x02];
    const data = [0xD0, 0xB0, 0x00]; // 0x00は仮CHが入る
    return super.writeWithBle(super.setQueryDataForArray(adrs, data))
    .then(recvData => {
      u.logger.info(`recvData :${recvData}`);
      return this.getQueryData(recvData);
    })
    .catch(e => u.logger.error(e.message));
  }

  // 設定モード解除（赤外線解除設定）
  makeCommandEndSettingMode() {
    // 送信用データ作成
    const adrs = [0x01, 0x20, 0x02];
    const data = [0xD0, 0xB0, 0xFF];  // 固定
    return super.writeWithBle(super.setQueryDataForArray(adrs, data))
    .then(recvData => {
      u.logger.info(`recvData :${recvData}`);
      return this.getQueryData(recvData);
    })
    .catch(e => u.logger.error(e.message));
  }
}
export default {
  Bluetooth,
};
