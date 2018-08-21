import { Util as u, mixin } from '@/modules/util';

export default {
  mixins: [mixin],
  props: ['toggle'],
  data() {
    return {
      isManage: false,
      status: u.blue.status,
      action: {
        create: this.create,
      },
    };
  },
  created() {
    u.ui.on('connected', this.connected);
  },
  methods: {
    connected() {
      this.isManage = true;
    },
    create() {
      this.isManage = false;
    },
  },
};
