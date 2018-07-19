import NewNotePage from '@/components/newNotePage';

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
