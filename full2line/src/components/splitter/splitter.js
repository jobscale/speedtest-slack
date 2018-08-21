import { mixin } from '@/modules/util';

export default {
  mixins: [mixin],
  data() {
    return {
      current: 'SplitterHome',
      pages: [{
        caption: this.translate('common.home'),
        name: 'SplitterHome',
      }, {
        caption: 'News',
        name: 'SplitterNews',
      }, {
        caption: 'Settings',
        name: 'SplitterSettings',
      }],
      openSide: false,
    };
  },
};
