import { Util as u } from '@/modules/util';

export const Mock = {
  assign(blue) {
    u.merge(blue, this);
  },
  getPower() {
    return this.status.power ? this.status.power-- : this.status.power = 5;
  },
  connect(param) {
    const promise = u.promise();
    const cb = () => {
      u.merge(this.status, param);
      this.status.active = true;
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
};
export default {
  Mock,
};
