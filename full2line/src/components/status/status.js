import { Util as u, mixin } from '@/modules/util';

export default {
  mixins: [mixin],
  data() {
    return {
      text: undefined,
      isModal: false,
      status: u.blue.status,
      nameCSV: this.$store.getters.getNameCSV,
    };
  },
  methods: {
    disconnect() {
      u.blue.disconnect()
      .then(() => {
        this.text = u.translate('message.disconnect');
        this.isModal = true;
      })
      .catch(e => u.logger.error(e.message));
    },
    reconnect() {
      u.blue.connect()
      .then(() => {
        this.text = u.translate('message.reconnect');
        this.isModal = true;
      })
      .catch(e => u.logger.error(e.message));
    },
  },
};
