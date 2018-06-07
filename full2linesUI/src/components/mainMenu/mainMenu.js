import HomePage from '../HomePage/HomePageA'

export default {
  name: 'MainMenu',
  data () {
    return {
      menuList: [
        {
          label: 'Directive',
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
      this.$emit('click-menu-item', page);
    }
  }
}
