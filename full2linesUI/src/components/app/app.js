import HomePageA from '../HomePage/HomePageA'
import MainNavigatorA from '../mainnavigator/AppMainNavigator'
import MainMenu from '../MainMenu/AppMainMenu'

export default {
  name: 'app',
  data () {
    return {
      nextPage: ''
    }
  },
  computed: {
    menuIsOpen: {
      get () {
        return this.$store.state.splitter.open
      },
      set (newValue) {
        this.$store.commit('splitter/toggle', newValue)
      }
    }
  },
  methods: {
    clickMenuItem: function (page) {
      console.log(page)
      this.nextPage = page
    }
  },
  components: {
    MainNavigatorA,
    MainMenu,
    HomePageA
  }
}
