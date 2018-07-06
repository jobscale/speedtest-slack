import { Util as u } from '@/modules/util';

export default {
  methods: {
    translate: u.translate,
    open(name) {
      this.$emit('push-page', u.components[name]);
    },
  },
};
