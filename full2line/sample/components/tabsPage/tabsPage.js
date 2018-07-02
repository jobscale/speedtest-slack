import NotesPage from '@/components/notesPage/NotesPage.vue';
import SplitterPage from '@/components/splitterPage/SplitterPage.vue';
import CarouselPage from '@/components/carousel/Carousel.vue';
import Dialogs from '@/components/dialogs/Dialogs.vue';
import GoingPage from '@/components/goingPage/GoingPage.vue';

export default {
  data() {
    return {
      tabs: [
        {
          icon: 'fa-tag',
          label: 'Splitter',
          page: SplitterPage,
        },
        {
          icon: 'fa-book',
          label: 'Notes',
          page: NotesPage,
        },
        {
          icon: 'md-search',
          label: 'Carousel',
          page: CarouselPage,
        },
        {
          icon: 'fa-bar-chart',
          label: 'Dialogs',
          page: Dialogs,
        },
        {
          icon: 'ion-ios-settings',
          label: 'Settings',
          page: GoingPage,
        },
      ],
    };
  },
};
