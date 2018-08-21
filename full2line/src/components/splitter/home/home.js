import { Util as u } from '@/modules/util';

export default {
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
    translate: u.translate,
    connected() {
      this.isManage = true;
    },
    create() {
      this.isManage = false;
    },
  },
};
