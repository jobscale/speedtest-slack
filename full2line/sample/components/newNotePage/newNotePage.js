export default {
  data() {
    return {
      title: '',
      description: '',
    };
  },
  methods: {
    done() {
      this.$store.commit('addNote', {
        title: this.title,
        description: this.description,
      });
      this.$emit('pop-page');
    },
  },
};
