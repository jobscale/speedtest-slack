import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      pageStack: ['Splitter'],
      animation: ['slide', 'lift', 'fade', 'none'][3],
    };
  },
  created() {
    this.initEvent();
  },
  methods: {
    translate: u.translate,
    initEvent() {
      u.blue.on('disconnect', this.disconnect);
    },
    disconnect() {
      u.logger.info('info', 'disconnect ble.');
      this.pageStack.length = 1;
      u.modalText = u.translate('event.disconnect');
      this.pageStack.push('Modal');
    },
  },
};
