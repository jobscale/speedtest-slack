import util from '@/modules/util';

export default {
  data() {
    return {
      translate: util.translate,
      current: 'SplitterPageHome',
      pages: [{
        caption: util.translate('common.home'),
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
    util.logging('change-animation');
  },
  methods: {
  },
};
