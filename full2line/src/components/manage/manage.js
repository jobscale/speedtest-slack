import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      isExpanded: false,
      isCollapse: true,
      isDropped: false,
    };
  },
  methods: {
    translate: u.translate,
    close() {
      u.splitter.$emit('pop-page');
    },
  },
};
