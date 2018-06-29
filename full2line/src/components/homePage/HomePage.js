const strings = require('../../common/strings.json');

export default {
  name: 'HomePageA',
  components: {
  },
  data() {
    return {
      title: strings.homepage.main_title,
      name: '',
      backButtonTitle: strings.common.backButton,
      nextButtonTitle: strings.homepage.input,
      listItemTitle: strings.homepage.enoki
    }
  },
  created() {
    // 初期化処理
  },
  methods: {
    clickButton() {
      this.name = strings.homepage.shiitake;
    }
  }
};
