import HomePage from '../HomePage/HomePageA'

export default {
  name: 'MainMenu',
  data () {
    return {
      menuList: [
        {
          label: 'エリンギ',
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
    clickMenu (page) {
      console.log("click-menu-item");
      this.$emit('click-menu-item', page);
    }
  }
}
