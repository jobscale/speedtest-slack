import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      email: '',
      password: '',
      confirm: '',
      style: {
        fixEmail: false,
        fixPassword: false,
        fixConfirm: false,
      },
    };
  },
  methods: {
    translate: u.translate,
    close() {
      this.$emit('pop-page');
    },
    next(name) {
      this.style[`fix${name}`] = true;
    },
  },
};
