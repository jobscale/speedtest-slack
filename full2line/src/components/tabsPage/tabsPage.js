import NotesPage from '@/components/notesPage';
import SplitterPage from '@/components/splitterPage';
import CarouselPage from '@/components/carousel';
import Dialogs from '@/components/dialogs';
import GoingPage from '@/components/goingPage';

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
