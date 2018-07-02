import Second from '../second';

export default {
  key: 'page1',
  methods: {
    push() {
      this.$emit('push-page', Second);
    },
  },
};
