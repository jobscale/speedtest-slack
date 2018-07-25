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
        this.$ons.notification.toast('切断しました。', { timeout: 3000 });
        this.$emit('pop-page');
      })
      .catch(e => u.logger.error(e.message));
    },
  },
};
