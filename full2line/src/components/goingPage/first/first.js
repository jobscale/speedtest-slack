import Second from '../second';

export default {
  methods: {
    push() {
      this.$emit('push-page', Second);
    },
  },
};
