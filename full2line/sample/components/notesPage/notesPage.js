import NewNotePage from '@/components/newNotePage/NewNotePage.vue';

export default {
  data() {
    return {
      actionSheetVisible: false,
    };
  },
  computed: {
    noteGroups: {
      get() {
        return this.$store.state.noteGroups;
      },
    },
  },
  methods: {
    showNewNotePage() {
      this.$emit('push-page', NewNotePage);
    },
  },
};
