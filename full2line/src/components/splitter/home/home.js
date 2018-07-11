import { Util as u } from '@/modules/util';

export default {
  props: ['toggleMenu'],
  created() {
    u.splitter.$emit('push-page', u.components.Wizard);
  },
  methods: {
    translate: u.translate,
    open(name) {
      u.splitter.$emit('push-page', u.components[name]);
    },
  },
};
