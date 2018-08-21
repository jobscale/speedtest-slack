import { mixin } from '@/modules/util';

export default {
  mixins: [mixin],
  methods: {
    open(name) {
      this.$emit('pop-page');
      this.$emit('push-page', name);
    },
  },
};
