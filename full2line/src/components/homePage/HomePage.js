var strings = require('../../common/strings.json');

export default {
  name: 'HomePageA',
  components: {
  },
  data() {
    return {
      title: strings["main_title"],
      name: '',
      nextButtonTitle: strings["input"],
      listItemTitle: strings["enoki"]
    }
  },
  created() {
    // 初期化処理
  },
  methods: {
    clickButton() {
      this.name = strings["shiitake"];
    }
  }
};
