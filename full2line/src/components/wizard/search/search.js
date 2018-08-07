import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      isTips: false,
      current: {},
      status: u.blue.status,
    };
  },
  created() {
    u.blue.scan()
    .then(devices => {
      u.logger.assert(this.status.devices === devices);
      u.logger.info('search::created()', devices);
    })
    .catch(e => this.$ons.notification.toast(`エラー: ${e.message}`, { timeout: 3000 }));
  },
  methods: {
    translate: u.translate,
    close() {
      u.blue.writeData(closure => {
        u.logger.info(`closure :${closure}`);
      });
      this.$emit('pop-page');
    },
    connect(id) {
      this.current = u.find(this.status.devices, { id });
      u.blue.connect(this.current)
      .then(() => this.isTips = true)
      .catch(e => {
        u.logger.error(e.message);
        u.modalText = u.translate('error.connect');
        this.$emit('push-page', 'Modal');
      });
    },
  },
};
