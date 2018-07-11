import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      isTips: false,
    };
  },
  methods: {
    translate: u.translate,
    close() {
      this.$emit('pop-page');
    },
  },
};
