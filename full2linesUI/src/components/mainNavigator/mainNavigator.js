import pageTestHome from '../pageTestHome/TestPageHome'
// import pageTest1 from '../HomePage/HomePageA'

export default {
  name: 'MainNavigator',
  props: ['nextPage'],
  data () {
    return {
      pageStack: [pageTestHome]
    }
  },
  methods: {
  },
  watch: {
    nextPage: function (newVal, oldVal) { // watch it
      this.pageStack.push(newVal)
    }
  },
  components: {
    pageTestHome
  }
}
