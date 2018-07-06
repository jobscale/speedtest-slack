import { Util as u } from '@/modules/util';

export default {
  methods: {
    translate: u.translate,
    onClick() {
      this.$emit('pop-page');
    },
  },
};
