const strings = require('../../common/strings.json');
import HomePage from '../homePage/HomePageA';

export default {
  name: 'pageTestHome',
  components: {
  },
  data() {
    return {
      title: strings.pagetest1.title,
      nextButtonTitle: strings.pagetest1.buttontitle
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
