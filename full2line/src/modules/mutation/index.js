import { Util as u } from '@/modules/util';
import { Constant } from '@/base/common';

const Finder = {
  findInterface(state, param) {
    return u.find(state.interfaces, { id: param.idInterface }) || {};
  },
  findSensor(state, param) {
    return u.find(this.findInterface(state, param).sensors, { id: param.idSensor }) || {};
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
      this.$store.commit('setInterface', {
        idInterface: 1,
        name: 'first interface',
        macAddress: 'mac-address',
      });
      this.$store.commit('setSensor', {
        idInterface: 1,
        idSensor: 1,
        name: 'first sensor',
        macAddress: 'mac-address',
      });
      this.$store.commit('setLine', {
        idInterface: 1,
        idSensor: 1,
        idLine: 1,
        /** circuit:number 1〜28, 予備として 29〜32
         * 設定器内ユニークである必要がある */
        circuit: Math.floor(Math.random() * 27) + 1,
      });
      this.$store.commit('setItem', {
        idInterface: 1,
        idSensor: 1,
        idLine: 1,
        id: 1,
        name: 'first item',
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
      idInterface: 1,
      idSensor: 1,
      idLine: 1,
      nameCSV: 'Aチーム用',
    };
    /**
     * データ構造
     */
    (o => o)(state).interfaces = [ // maxInterface
      {
        id: 1,
        name: 'interface',
        macAddress: 'm-a-c-a-d-d-r-e-s-s',
        sensors: [ // maxSensor
          {
            lux: 1000, // 輝度計測
            id: 1,
            name: 'sensor',
            macAddress: 'm-a-c-a-d-d-r-e-s-s',
            lines: [ // maxLine
              {
                torque: { // 出力輝度設定
                  set: 700,
                  min: 20,
                  max: 80,
                },
                color: 90,
                id: 1,
                circuit: 1, // 調光回路ID
                items: [ // maxItem
                  {
                    id: 1,
                    name: 'item',
                    macAddress: 'm-a-c-a-d-d-r-e-s-s',
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  },
  initialize(state) {
    (o => o)(state).current = {};
    (o => o)(state).interfaces = [];
  },
  dump(state) {
    u.logger.info(JSON.stringify(state));
  },
  setCurrentInterface(state, param) {
    (o => o)(state).current.idInterface = param.id;
  },
  setCurrentSensor(state, param) {
    (o => o)(state).current.idSensor = param.id;
  },
  setCurrentLine(state, param) {
    (o => o)(state).current.idLine = param.id;
  },
  setInterface(state, param) {
    let obj = Finder.findInterface(state, param);
    if (u.keys(obj).length) {
      obj.name = param.name;
      return;
    }
    const interfaces = state.interfaces;
    if (interfaces.length >= Constant.maxInterface) throw new Error('application error');
    interfaces.push(obj = {
      id: param.idInterface,
      name: param.name,
      macAddress: param.macAddress,
      sensors: [],
    });
    u.sortBy(interfaces, ['id']);
  },
  setSensor(state, param) {
    let obj = Finder.findSensor(state, param);
    if (u.keys(obj).length) {
      obj.name = param.name;
      return;
    }
    const sensors = Finder.findInterface(state, param).sensors;
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
    const items = Finder.findLine(state, param).items;
    if (items.length >= Constant.maxItem) throw new Error('application error');
    items.push(obj = {
      id: param.id,
      name: param.name,
      macAddress: param.macAddress,
    });
    u.sortBy(items, ['id']);
  },
  removeInterface(state, param) {
    const interfaces = state.interfaces;
    u.remove(interfaces, { id: param.idInterface });
  },
  removeSensor(state, param) {
    const sensors = Finder.findInterface(state, param).sensors;
    u.remove(sensors, { id: param.idSensor });
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
  getInterface(state) {
    return Finder.findInterface(state, {
      idInterface: state.current.idInterface,
    });
  },
  getSensor(state) {
    return Finder.findSensor(state, {
      idSensor: state.current.idSensor,
    });
  },
  getLine(state) {
    return Finder.findLine(state, {
      idInterface: state.current.idInterface,
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
    const obj = Finder.findInterface(state, {
      idInterface: state.current.idInterface,
    });
    const busy = [];
    u.each(obj ? obj.sensors : [], sensor => {
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
