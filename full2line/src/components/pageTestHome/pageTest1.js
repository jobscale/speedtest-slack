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
      scanUuid: "ee5ffac6-eca7-46b4-99cf-eca4ad20e594",
      serviceUuid: "d37b0820-34ef-4f73-9b1d-c1c9882c1f45",
      readCharacteristicUuid: "c3988d7e-9695-4e82-8d36-6b7fefd63f77",
      writeCharacteristicUuid: "c3988d7e-9695-4e82-8d36-6b7fefd63f77",
      indicateCharacteristicUuid: "c3cf560a-ab94-4ac2-9051-a266104568ad",
      bleTitle: "BLE 動作確認",
      scanButtonTitle: "スキャン",
      connectButtonTitle: "接続",
      disconnectButtonTitle: "切断",      
      requestMtuButtonTitle: "MTU要求",
      readButtonTitle: "読み込み",
      writeButtonTitle: "書き込み",
      startIndicationButtonTitle: "通告（indicate）開始",
      devices: [],
      selectedDevice: null,
      sizes: [20,21,160,170,181,182,183,184,185,186],
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
      requestMtuSuccessfulMessage: "MTU要求に成功しました。",
      requestMtuFailureMessage: "MTU要求に失敗しました。",
      readSuccessfulMessage: "読み込みに成功しました。読み込みバイト数：",
      readFailureMessage: "読み込みに失敗しました。",
      writeSuccessfulMessage: "書き込みに成功しました。",
      writeFailureMessage: "書き込みに失敗しました。",
      startIndicateSuccessfulMessage: "通告に成功しました。通告バイト数：",
      startIndicateFailureMessage: "通告に失敗しました。",
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
    clickRequestMtuButton() {
      console.log("clickRequestMtuButton");
      this.bleRequestMtu();
    },
    clickReadButton() {
      console.log("clickReadButton");
      this.bleRead();
    },
    clickWriteButton() {
      console.log("clickWriteButton");
      this.bleWrite(this.selectedSize);
    },
    clickStartIndicationButton() {
      console.log("clickStartIndicationButton");
      this.bleStartIndication();
    },
    clickItem(device) {
      console.log("clickItem");
      this.selectedDevice = device;
      this.showDialog(this.targetDeviceIsSelectedMessage);
    },
    bleScan() {
      this.devices = [];
      ble.scan([scanUuid], 10, (device) =>
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
    bleRequestMtu() {
      if (this.selectedDevice == null) {
        this.showDialog(this.targetDeviceIsNotSelectedMessage);
        return;
      }
      ble.isConnected(this.selectedDevice.id, () => 
      {
        console.log("isConnected success"); 
        ble.requestMtu(this.selectedDevice.id, 185, () => 
        {
          console.log("requestMtu success");
          this.showDialog(this.requestMtuSuccessfulMessage);
        }, () =>
        {
          console.log("requestMtu failure");
          this.showDialog(this.requestMtuFailureMessage);
        });
      }, () =>
      {
        console.log("isConnected failure");
        this.showDialog(this.targetDeviceIsNotConnectedMessage);
      });
    },
    bleRead() {
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
          this.showDialog(this.readSuccessfulMessage + rawData.byteLength);
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
      if (this.dialogVisible) {
        this.dialogMessage = this.dialogMessage + "<br>" + message;
      }
      else{
        this.dialogMessage = message;
      }
      this.dialogVisible = true;
    },
    bleStartIndication() {
      if (this.selectedDevice == null) {
        this.showDialog(this.targetDeviceIsNotSelectedMessage);
        return;
      }
      ble.isConnected(this.selectedDevice.id, () => 
      {
        console.log("isConnected success"); 
        ble.startNotification(this.selectedDevice.id, this.serviceUuid, this.indicateCharacteristicUuid, (rawData) => 
        {
          console.log("startNotification success");
          this.showDialog(this.startIndicateSuccessfulMessage + rawData.byteLength);
        }, () =>
        {
          console.log("startNotification failure");
          this.showDialog(this.startIndicateFailureMessage);
        });
      }, () =>
      {
        console.log("isConnected failure");
        this.showDialog(this.targetDeviceIsNotConnectedMessage);
      });
    },
  }
};
