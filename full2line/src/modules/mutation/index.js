import { Util as u } from '@/modules/util';
import { Constant } from '@/modules/common';

const Finder = {
  findSensor(state, param) {
    return u.find(state.sensors, { id: param.idSensor }) || {};
  },
  findLine(state, param) {
    return u.find(this.findSensor(state, param).lines, { id: param.idLine }) || {};
  },
  findItem(state, param) {
    return u.find(this.findLine(state, param).items, { id: param.id }) || {};
  },
};
export const ExampleStore = {
  /**
   * データ設定・取得見本、Mutation の UnitTest用
   * VueComponent から ExampleStore.example.bind(this)() として呼び出し可能
   */
  example() {
    const test = () => {
      const promise = u.promise();
      this.$store.commit('setSensor', {
        idSensor: 1,
        macAddress: 'mac-address',
      });
      this.$store.commit('setLine', {
        idSensor: 1,
        idLine: 1,
      });
      this.$store.commit('setItem', {
        idSensor: 1,
        idLine: 1,
        macAddress: 'mac-address',
      });
      promise.resolve('store test ok.');
      return promise.instance;
    };
    return test()
    .then(res => u.logger.info(res))
    .catch(e => u.logger(e.message));
  },
};
const Mutation = {
  /**
   * store で管理する情報の全て
   */
  dataTree(state) {
    /**
     * 現在設定中の対象ID
     */
    (o => o)(state).current = {
      idSensor: 1,
      idLine: 1,
    };
    /**
     * データ構造
     */
    (o => o)(state).sensors = [ // Aセンサー
      {
        idSensor: 10,                      // センサーID
        freqCh: 920,                       // 周波数CH
        macAddress: '00-11-22-33-44-55',  // MACアドレス
        controlModeChangerAddress: 1000,  // 制御モード切替アドレス
        illuminanceControl: {   // 一定値照度制御設定
          state: 1,             // 状態値 1:照度記憶 2:明るさ記憶
          illuminance: {        // 照度記憶
            measurement: 200,   // 輝度計測
            reference: 250,     // 基準照度
            normal: {           // 通常運転
              target: 220,      // 目標照度
              max: 300,         // 制御上限値
              min: 50,          // 制御下限値
            },
            scene: {            // シーン運転
              target: 220,      // 目標照度
              max: 300,         // 制御上限値
              min: 50,          // 制御下限値
            },
          },
          brightness: {         // 明るさ記憶
            normal: {           // 通常運転
              target: 80,      // 目標調光率
              max: 300,         // 制御上限値
              min: 50,          // 制御下限値
            },
            scene: {            // シーン運転
              target: 60,       // 目標比率
              max: 300,         // 制御上限値
              min: 50,          // 制御下限値
            },
          },
        },
        lines: [                  // 系統
          {
            idLine: 112,          // 調光回路ID
            address: 240,         // 調光用アドレス
            items: [              // 器具
              {
                idItem: 123,      // 器具ID
                macAddress: '66-55-44-33-22-11',  // MACアドレス
                hop: {            // ホップ設定
                  idHop: 221,     // ホップ回路ID
                  source: 201,    // 中継元器具ID
                  destinations: [  // ホップ中継先
                    {
                      idDest: 203,  // 中継先器具ID
                      macAddress: '33-44-55-11-22-66',  // MACアドレス
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    ];
  },
  initialize(state) {
    (o => o)(state).current = {};
    (o => o)(state).sensors = [];
  },
  dump(state) {
    u.logger.info(JSON.stringify(state));
  },
  setCurrentSensor(state, param) {
    (o => o)(state).current.idSensor = param.id;
  },
  setCurrentLine(state, param) {
    (o => o)(state).current.idLine = param.id;
  },
  setSensor(state, param) {
    let obj = Finder.findSensor(state, param);
    if (u.keys(obj).length) {
      obj.name = param.name;
      return;
    }
    const sensors = state.sensors;
    if (sensors.length >= Constant.maxSensor) throw new Error('application error');
    sensors.push(obj = {
      id: param.idSensor,
      name: param.name,
      macAddress: param.macAddress,
      lines: [
        { id: 1, items: [] },
        { id: 2, items: [] },
        { id: 3, items: [] },
        { id: 4, items: [] },
      ],
    });
    u.sortBy(sensors, ['id']);
  },
  /**
   * 調光回路IDを設定
   * @param state
   * @param param: {idLine, circuit}
   */
  setLine(state, param) {
    Finder.findLine(state, param).circuit = param.circuit;
  },
  setItem(state, param) {
    let obj = Finder.findItem(state, param);
    if (u.keys(obj).length) {
      obj.name = param.name;
      obj.macAddress = param.macAddress;
      return;
    }
    const line = Finder.findLine(state, param);
    if (line.items.length >= Constant.maxItem) throw new Error('application error');
    line.items.push(obj = {
      id: param.id,
      name: param.name,
      macAddress: param.macAddress,
    });
    line.items = u.sortBy(line.items, ['id']);
  },
  removeSensor(state, param) {
    u.remove(state.sensors, { id: param.idSensor });
  },
  removeItem(state, param) {
    const items = Finder.findLine(state, param).items;
    u.remove(items, { id: param.id });
  },
  setNameCSV(state, param) {
    (o => o)(state).current.nameCSV = param.name;
  },
};
const Getters = {
  getNameCSV(state) {
    return state.current.nameCSV;
  },
  getSensor(state) {
    return Finder.findSensor(state, {
      idSensor: state.current.idSensor,
    });
  },
  getLine(state) {
    return Finder.findLine(state, {
      idSensor: state.current.idSensor,
      idLine: state.current.idLine,
    });
  },
  /**
   * 空きの調光回路一覧
   */
  getFreeCircuit(state) {
    const circuits = [];
    for (let i = 1; i <= 28; i++) {
      circuits.push(i);
    }
    const busy = [];
    u.each(state.sensors ? state.sensors : [], sensor => {
      u.each(sensor.lines, line => {
        if (line.circuit) busy.push(line.circuit);
      });
    });
    return u.pullAll(circuits, busy);
  },
};
export const Mute = (base => {
  const obj = {};
  u.each(base, (v, k) => {
    obj[k] = (state, param) => base[k](state, param);
  });
  return obj;
})(Mutation);
export const Getter = (base => {
  const obj = {};
  u.each(base, (v, k) => {
    obj[k] = (state, param) => base[k](state, param);
  });
  return obj;
})(Getters);
export default {
  Mute,
  Getter,
};
