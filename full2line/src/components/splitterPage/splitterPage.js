import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      translate: u.translate,
      current: 'SplitterPageHome',
      pages: [{
        caption: u.translate('common.home'),
        name: 'SplitterPageHome',
      }, {
        caption: 'News',
        name: 'SplitterPageNews',
      }, {
        caption: 'Settings',
        name: 'SplitterPageSettings',
      }],
      openSide: false,
    };
  },
  created() {
    this.$emit('change-animation', 'fade');
    u.logger.log('change-animation');
  },
  methods: {
  },
};
