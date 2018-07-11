import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
    };
  },
  methods: {
    translate: u.translate,
    open(name) {
      u.splitter.$emit('pop-page');
      u.splitter.$emit('push-page', u.components[name]);
    },
    close() {
      u.splitter.$emit('pop-page');
    },
  },
};
