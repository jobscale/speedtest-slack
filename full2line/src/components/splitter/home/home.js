import { Util as u } from '@/modules/util';

export default {
  props: ['toggleMenu'],
  methods: {
    translate: u.translate,
    open(name) {
      u.navigator.push(u.components[name]);
    },
  },
};
