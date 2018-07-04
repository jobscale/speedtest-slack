export default {
  data() {
    return {
      modalVisible: false,
      timeoutID: 0,
    };
  },
  methods: {
    showModal() {
      this.modalVisible = true;
      clearTimeout(this.timeoutID);
      /* eslint-disable no-return-assign */
      this.timeoutID = setTimeout(() => this.modalVisible = false, 6000);
    },
  },
};
