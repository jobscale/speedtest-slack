export default {
  name: 'HomePageA',
  components: {
  },
  data() {
    return {
      title: 'Main Page - タイトル',
      name: '',
      nextButtonTitle: 'しいたけ入力',
      listItemTitle: 'えのき茸'
    }
  },
  created() {
    // 初期化処理
  },
  methods: {
    clickButton() {
      this.name = 'しいたけ';
    }
  }
};
