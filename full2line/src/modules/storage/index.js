import { Util as u } from '@/modules/util';
import { Storage as StorageBase } from '@/modules/common/storage';

export default class Storage extends StorageBase {
  constructor() {
    super();
    u.logger.log('Storage start.');
  }
}
