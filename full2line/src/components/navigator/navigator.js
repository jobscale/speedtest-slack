import { Util as u, mixin } from '@/modules/util';

export default {
  mixins: [mixin],
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
    initEvent() {
      u.blue.on('disconnect', this.disconnect);
    },
    goHome() {
      for (let i = 0; this.pageStack.length > 1; i++) this.pageStack.pop();
    },
    disconnect() {
      u.logger.info('info', 'disconnect ble.');
      this.$ons.notification.alert({
        title: null,
        messageHTML: `<div>${u.translate('event.disconnect')}</div>`,
        callback: () => this.goHome(),
      });
    },
  },
};
