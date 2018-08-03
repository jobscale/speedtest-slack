import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      itemId: [
        '11:11:11:11:11:11',
        '22:22:22:22:22:22',
        '33:33:33:33:33:33',
        '44:44:44:44:44:44',
        '55:55:55:55:55:55',
        '66:66:66:66:66:66',
        '77:77:77:77:77:77',
        '88:88:88:88:88:88',
        '99:99:99:99:99:99',
      ],
      checkedItemId: [],
      isDelMode: false,
    };
  },
  methods: {
    translate: u.translate,
    close() {
      this.$emit('pop-page');
    },
  },
};

