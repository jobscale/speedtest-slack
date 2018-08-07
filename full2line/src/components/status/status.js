import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
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
        this.$emit('pop-page');
        u.modalText = u.translate('message.disconnect');
        this.$emit('push-page', 'Modal');
      })
      .catch(e => u.logger.error(e.message));
    },
  },
};
