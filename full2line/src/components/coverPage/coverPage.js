import { Util as u } from '@/modules/util';

export default {
  methods: {
    translate: u.translate,
    startApp() {
      this.$emit('pop-page');
    },
  },
};
