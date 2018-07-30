import { Util as u } from '@/modules/util';

export default {
  data() {
    return {
      isTips: false,
      current: {},
      list: [
        {
          id: 1,
          name: 'first interface',
          macAddress: '12-34-56-78',
        },
      ],
    };
  },
  created() {
    u.blue.scan()
    .then((devices) => {
      this.list = devices;
      u.logger.info(`search::created() ${devices}`);
    });
  },
  methods: {
    translate: u.translate,
    close() {
      this.$emit('pop-page');
    },
    connect(id) {
      this.current = u.find(this.list, { id });
      u.blue.connect(this.current)
      .then(() => this.isTips = true)
      .catch(e => u.logger.error(e.message));
    },
  },
};
