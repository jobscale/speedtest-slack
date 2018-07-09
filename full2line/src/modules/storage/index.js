import { Util as u } from '@/modules/util';
import { Storage as Base } from '@/modules/common/storage';

export default class Storage extends Base {
  constructor() {
    super();
    u.logger.log('Storage start.');
  }
}
