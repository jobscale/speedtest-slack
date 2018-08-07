import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      text: u.modalText,
    };
  },
  methods: {
    translate: u.translate,
    close() {
      this.$emit('pop-page');
    },
  },
};
