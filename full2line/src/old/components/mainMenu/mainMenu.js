const strings = require('../../common/strings.json');
import HomePage from '../homePage/HomePageA';

export default {
  name: 'MainMenu',
  data() {
    return {
      menuList: [
        {
          label: strings.mainmenu.eringi,
          page: HomePage
        }
      ]
    }
  },
  methods: {
    /**
     * メニューのクリックイベント
     * @param {VueComponent} page 遷移先のぺーず
     */
    clickMenu(page) {
      console.log("click-menu-item");
      this.$emit('click-menu-item', page);
    }
  }
};
