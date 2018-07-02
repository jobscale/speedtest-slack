import Second from '../second/Second';

export default {
  key: 'page1',
  methods: {
    push() {
      this.$emit('push-page', Second);
    },
  },
};
