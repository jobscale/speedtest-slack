import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      status: u.blue.status,
    };
  },
  methods: {
    translate: u.translate,
    close() {
      this.$emit('pop-page');
    },
  },
};
