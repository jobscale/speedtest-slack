import { Util as u } from '@/modules/util';

export const Mock = {
  assign(blue) {
    u.merge(blue, this);
  },
  getPower() {
    return this.status.power ? this.status.power-- : this.status.power = 5;
  },
  scan() {
    const promise = u.promise();
    this.status.devices = [
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
    promise.resolve(this.status.devices);
    return promise.instance;
  },
  connect(device) {
    const promise = u.promise();
    const cb = () => {
      this.status.active = true;
      this.status.device = device;
      this.status.power = 5;
      promise.resolve('ok');
    };
    setTimeout(cb, 200);
    return promise.instance;
  },
  disconnect() {
    const promise = u.promise();
    const cb = () => {
      this.status.active = false;
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
    setTimeout(cb, 2000);
    return this.promiseindingSensor.instance;
  },
  cancelFindingSensor() {
    const sensor = {
      status: 'canceled',
    };
    this.promiseindingSensor.resolve(sensor);
  },
};
export default {
  Mock,
};
