import { Util as u } from '@/modules/util';

export default {
  methods: {
    translate: u.translate,
    close() {
      this.$emit('pop-page');
    },
  },
};
