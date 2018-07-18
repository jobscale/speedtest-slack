import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      current: 'SplitterHome',
      pages: [{
        caption: u.translate('common.home'),
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
  methods: {
    translate: u.translate,
  },
};
