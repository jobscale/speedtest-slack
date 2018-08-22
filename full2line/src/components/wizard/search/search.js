import { Util as u, mixin } from '@/modules/util';

export default {
  mixins: [mixin],
  data() {
    return {
      text: {
        processing: undefined,
        modal: undefined,
      },
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
    connect(id) {
      this.current = u.find(this.status.devices, { id });
      this.text.processing = u.translate('message.connecting');
      u.blue.connect(this.current)
      .then(() => this.text.modal = this.translate('wizard.search.modal.text', { macAddress: this.current.id }))
      .catch(e => this.alert(e))
      .then(() => this.text.processing = undefined);
    },
    alert(e) {
      u.logger.error(e.message);
      this.$ons.notification.alert({
        title: null,
        messageHTML: `<div>${u.translate('error.connect')}</div>`,
        callback: () => undefined,
      });
    },
    connected() {
      u.ui.fire('connected');
      this.close();
    },
  },
};
