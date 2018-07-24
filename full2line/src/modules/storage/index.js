import { Util as u } from '@/modules/util';
import { Storage as Base } from '@/modules/common/storage';

export class Storage extends Base {
  constructor() {
    super();
    u.logger.info('start', 'Storage');
  }
  initialize() {}
}
export default {
  Storage,
};
