import { Util as u } from '@/modules/util';

export class Mock {
  constructor(blue) {
    this.blue = blue;
  }
  getPower() {
    return this.blue.status.power ? this.blue.status.power-- : this.blue.status.power = 5;
  }
  scan() {
    const promise = u.promise();
    promise.resolve([
      {
        id: 1,
        name: 'first interface',
        macAddress: '12-34-56-78',
      },
      {
        id: 2,
        name: 'second interface',
        macAddress: '34-56-78-12',
      },
      {
        id: 3,
        name: 'third interface',
        macAddress: '56-78-12-34',
      },
    ]);
    return promise.instance;
  }
  connect(param) {
    const promise = u.promise();
    const cb = () => {
      u.merge(this.blue.status, param);
      this.blue.status.active = true;
      this.blue.status.power = 5;
      promise.resolve('ok');
    };
    setTimeout(cb.bind(this), 200);
    return promise.instance;
  }
  disconnect() {
    const promise = u.promise();
    const cb = () => {
      this.blue.status.active = false;
      this.blue.status.power = -1;
      promise.resolve('ok');
    };
    setTimeout(cb.bind(this), 200);
    return promise.instance;
  }
}
export default {
  Mock,
};
