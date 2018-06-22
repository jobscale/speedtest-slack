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
      serviceUuid: "d37b0820-34ef-4f73-9b1d-c1c9882c1f45",
      readCharacteristicUuid: "c3cf560a-ab94-4ac2-9051-a266104568ad",
      writeCharacteristicUuid: "cc363ec4-2184-4281-b091-8e557fd9b9a2",
      bleTitle: "BLE 動作確認",
      scanButtonTitle: "スキャン",
      connectButtonTitle: "接続",
      disconnectButtonTitle: "切断",      
      readButtonTitle: "読み込み",
      writeButtonTitle: "書き込み",
      devices: [],
      selectedDevice: null,
      sizes: [20,21,185,186],
      selectedSize: 20,
      dialogVisible: false,
      dialogMessage: "",
      targetDeviceIsSelectedMessage: "接続先が設定されました。接続ボタンを押してください。",
      targetDeviceIsNotSelectedMessage: "接続先が設定されていません。スキャンボタンを押してください。",
      targetDeviceIsNotConnectedMessage: "接続されていません。接続ボタンを押してください。",
      connectionSuccessfulMessage: "接続に成功しました。",
      connectionFailureMessage: "接続に失敗しました。",
      disconnectionSuccessfulMessage: "切断に成功しました。",
      disconnectionFailureMessage: "切断に失敗しました。",
      readSuccessfulMessage: "読み込みに成功しました。",
      readFailureMessage: "読み込みに失敗しました。",
      writeSuccessfulMessage: "書き込みに成功しました。",
      writeFailureMessage: "書き込みに失敗しました。",
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
    clickReadButton() {
      console.log("clickReadButton");
      this.bleRead(this.selectedSize);
    },
    clickWriteButton() {
      console.log("clickWriteButton");
      this.bleWrite(this.selectedSize);
    },
    clickItem(device) {
      console.log("clickItem");
      this.selectedDevice = device;
      this.showDialog(this.targetDeviceIsSelectedMessage);
    },
    bleScan() {
      this.devices = [];
      ble.scan([], 10, (device) =>
      {
        console.log("scan success name:" + device.name + " id:" + device.id + " rssi:" + device.rssi);
        //異常値排除
        if (device.rssi === 127) {
          return;
        }
        //重複排除
        this.devices.forEach((scanDevice) =>
        {
          if(scanDevice.id === device.id){
            return;
          }
        });
        this.devices.push(device);
        //降順にソート
        this.devices.sort(function(a,b){
          if(a.rssi > b.rssi) return -1;
          if(a.rssi < b.rssi) return 1;
          return 0;
        });
      }, (reason) =>
      {
        console.log("scan failure reason:" + reason);
      });
    },
    bleConnect() {
      if (this.selectedDevice == null) {
        this.showDialog(this.targetDeviceIsNotSelectedMessage);
        return;
      }
      ble.connect(this.selectedDevice.id, (data) => 
      {
        console.log("connect success");
        this.showDialog(this.connectionSuccessfulMessage);
      }, () =>
      {
        console.log("connect failure");
        this.showDialog(this.connectionFailureMessage);
      });
    },
    bleDisconnect() {
      if (this.selectedDevice == null) {
        this.showDialog(this.targetDeviceIsNotSelectedMessage);
        return;
      }
      ble.disconnect(this.selectedDevice.id, () =>
      {
        console.log("disconnect success");
        this.showDialog(this.disconnectionSuccessfulMessage);
      }, () =>
      {
        console.log("disconnect failure");
        this.showDialog(this.disconnectionFailureMessage);
      });
    },
    bleRead(size) {
      if (this.selectedDevice == null) {
        this.showDialog(this.targetDeviceIsNotSelectedMessage);
        return;
      }
      ble.isConnected(this.selectedDevice.id, () => 
      {
        console.log("isConnected success"); 
        ble.read(this.selectedDevice.id, this.serviceUuid, this.readCharacteristicUuid, (rawData) => 
        {
          console.log("read success");
          this.showDialog(this.readSuccessfulMessage);
        }, () =>
        {
          console.log("read failure");
          this.showDialog(this.readFailureMessage);
        });
      }, () =>
      {
        console.log("isConnected failure");
        this.showDialog(this.targetDeviceIsNotConnectedMessage);
      });
    },
    bleWrite(size) {
      if (this.selectedDevice == null) {
        this.showDialog(this.targetDeviceIsNotSelectedMessage);
        return;
      }
      ble.isConnected(this.selectedDevice.id, () => 
      {
        console.log("isConnected success");
        var data = new ArrayBuffer(size); 
        ble.write(this.selectedDevice.id, this.serviceUuid, this.writeCharacteristicUuid, data, () => 
        {
          console.log("write success");
          this.showDialog(this.writeSuccessfulMessage);
        }, () =>
        {
          console.log("write failure");
          this.showDialog(this.writeFailureMessage);
        });
      }, () =>
      {
        console.log("isConnected failure");
        this.showDialog(this.targetDeviceIsNotConnectedMessage);
      });
    },
    showDialog(message) {
      this.dialogMessage = message;
      this.dialogVisible = true;
    },
  }
};
