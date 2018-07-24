import { Util as u } from '@/modules/util';
import { Constant } from '@/base/common';

const Mutation = {
  clear(state) {
    (obj => obj)(state).interfaces = [];
  },
  dump(state) {
    u.logger.info(JSON.stringify(state));
  },
  findInterface(state, param) {
    return u.find(state.interfaces, { id: param.idInterface });
  },
  findSensor(state, param) {
    return u.find(this.findInterface(state, param).sensors, { id: param.idSensor });
  },
  findLine(state, param) {
    return u.find(this.findSensor(state, param).lines, { id: param.idLine });
  },
  findItem(state, param) {
    return u.find(this.findLine(state, param).items, { id: param.id });
  },
  setInterface(state, param) {
    let obj = this.findInterface(state, param);
    if (obj) {
      obj.name = param.name;
      return obj;
    }
    const interfaces = state.interfaces;
    if (interfaces.length >= Constant.maxInterface) return undefined;
    interfaces.push(obj = {
      id: param.idInterface,
      name: param.name,
      sensors: [],
    });
    u.sortBy(interfaces, ['id']);
    return obj;
  },
  setSensor(state, param) {
    let obj = this.findSensor(state, param);
    if (obj) {
      obj.name = param.name;
      return obj;
    }
    const sensors = this.findInterface(state, param).sensors;
    if (sensors.length >= Constant.maxSensor) return undefined;
    sensors.push(obj = {
      id: param.idSensor,
      name: param.name,
      lines: [
        { id: 1, items: [] },
        { id: 2, items: [] },
        { id: 3, items: [] },
        { id: 4, items: [] },
      ],
    });
    u.sortBy(sensors, ['id']);
    return obj;
  },
  setItem(state, param) {
    let obj = this.findItem(state, param);
    if (obj) {
      obj.name = param.name;
      obj.macAddress = param.macAddress;
      return obj;
    }
    const items = this.findLine(state, param).items;
    if (items.length >= Constant.maxItem) return undefined;
    items.push(obj = {
      id: param.id,
      name: param.name,
      macAddress: param.macAddress,
    });
    u.sortBy(items, ['id']);
    return obj;
  },
  removeInterface(state, param) {
    const interfaces = state.interfaces;
    u.remove(interfaces, { id: param.idInterface });
  },
  removeSensor(state, param) {
    const sensors = this.findInterface(state, param).sensors;
    u.remove(sensors, { id: param.idSensor });
  },
  removeItem(state, param) {
    const items = this.findLine(state, param).items;
    u.remove(items, { id: param.id });
  },
};
export const Mute = (base => {
  const obj = {};
  u.each(Mutation, (v, k) => {
    obj[k] = (state, param) => base[k](state, param);
  });
  return obj;
})(Mutation);
export default {
  Mute,
};
