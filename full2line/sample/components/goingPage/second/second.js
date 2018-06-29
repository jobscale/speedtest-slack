export default {
  key: 'page2',
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
      this.timeoutID = setTimeout(() => this.modalVisible = false, 6000);
    }
  }
};
