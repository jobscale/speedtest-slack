import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      isProcessing: false,
      isTips: true,
    };
  },
  methods: {
    translate: u.translate,
    close() {
      this.$emit('pop-page');
    },
  },
};
