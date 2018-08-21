import { mixin } from '@/modules/util';

export default {
  mixins: [mixin],
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
    next(name) {
      this.style[`fix${name}`] = true;
    },
  },
};
