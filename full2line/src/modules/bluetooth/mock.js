import { Util as u } from '@/modules/util';

export class Mock {
  constructor(blue) {
    this.blue = blue;
  }
  getPower() {
    return this.blue.status.power ? this.blue.status.power-- : this.blue.status.power = 5;
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
