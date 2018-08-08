import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      text: 'sample',
      isModal: false,
      status: u.blue.status,
      nameCSV: this.$store.getters.getNameCSV,
    };
  },
  methods: {
    translate: u.translate,
    close() {
      this.$emit('pop-page');
    },
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
