import { Util as u } from '@/modules/util';

export default {
  props: ['toggleMenu'],
  methods: {
    translate: u.translate,
    open(name) {
      u.splitter.$emit('push-page', u.components[name]);
    },
  },
};
