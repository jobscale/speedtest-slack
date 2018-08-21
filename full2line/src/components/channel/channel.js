import { mixin } from '@/modules/util';

export default {
  mixins: [mixin],
  data() {
    return {
      isProcessing: false,
      isTips: true,
    };
  },
};
