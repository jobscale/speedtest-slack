import util from '@/modules/util';

export default {
  data() {
    return {
      translate: util.translate,
    };
  },
  props: ['title', 'action'],
};
