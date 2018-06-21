const strings = require('../../common/strings.json');
import HomePage from '../homePage/HomePageA';

export default {
  name: 'pageTestHome',
  components: {
  },
  data() {
    return {
      title: strings.pagetest1.title,
      nextButtonTitle: strings.pagetest1.buttontitle,
      bleTitle: "BLE 接続先のデバイス名:",
      scanButtonTitle: "スキャン",
      connectButtonTitle: "接続",
      disconnectButtonTitle: "切断",
      targetDeviceName: "EP",
      targetDeviceId: "",
      dialogVisible: false,
      dialogMessage: "",
      targetDeviceIsFoundMessage: "デバイスが見つかりました。",
      connectionSuccessfulMessage: "接続に成功しました。",
      connectionFailureMessage: "接続に失敗しました。",
      disconnectionSuccessfulMessage: "切断に成功しました。",
      disconnectionFailureMessage: "切断に失敗しました。",
    };
  },
  created() {
    // 初期化処理
  },
  methods: {
    clickNextButton() {
      console.log("clickNextButton");
      this.$emit('push-page', HomePage);
    },
    clickScanButton() {
      console.log("clickScanButton");
      this.bleScan();
    },
    clickConnectButton() {
      console.log("clickConnectButton");
      this.bleConnect();
    },
    clickDisconnectButton() {
      console.log("clickDisconnectButton");
      this.bleDisconnect();
    },
    bleScan() {
      console.log("target device name is " + this.targetDeviceName + ".");
      ble.scan([], 10, (device) =>
      {
        console.log("scan success name:" + device.name + " id:" + device.id + " rssi:" + device.rssi);
        if (device.name === this.targetDeviceName) {
          console.log("target device is found.");
          this.dialogMessage = this.targetDeviceIsFoundMessage;
          this.dialogVisible = true;
          this.targetDeviceId = device.id;   
          ble.stopScan();    
        }
      }, (reason) =>
      {
        console.log("scan failure  reason:" + reason);
      });
    },
    bleConnect() {
      console.log("target device id is " + this.targetDeviceId + ".");
      ble.connect(this.targetDeviceId, (result) => 
      {
        console.log("connect success");
        this.dialogMessage = this.connectionSuccessfulMessage;
        this.dialogVisible = true;
      }, () =>
      {
        console.log("connect failure");
        this.dialogMessage = this.connectionFailureMessage;
        this.dialogVisible = true;
      });
    },
    bleDisconnect() {
      ble.disconnect(this.targetDeviceId, () =>
      {
        console.log("disconnect success");
        this.dialogMessage = this.disconnectionSuccessfulMessage;
        this.dialogVisible = true;
      }, () =>
      {
        console.log("disconnect failure");
        this.dialogMessage = this.disconnectionFailureMessage;
        this.dialogVisible = true;
      });
    },
  }
};
