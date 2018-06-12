import HomePage from '../homePage/HomePageA';
export default {
  name: 'pageTestHome',
  components: {
  },
  data() {
    return {
      title: "タイトル",
      nextButtonTitle: "しめじを取りに行く"
    };
  },
  created() {
    // 初期化処理
  },
  methods: {
    clickNextButton() {
      console.log("clickNextButton");
      this.$emit('push-page', HomePage);
    }
  }
};
