import { logging } from '@/modules/logging';

export default {
  data() {
    return {
      current: 'SplitterPageHome',
      pages: [{
        caption: 'Home',
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
    logging('change-animation');
  },
  methods: {
  },
};
