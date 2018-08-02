import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
    };
  },
  methods: {
    translate: u.translate,
    open(name) {
      this.$emit('pop-page');
      this.$emit('push-page', name);
    },
    close() {
      this.$emit('pop-page');
    },
  },
};
