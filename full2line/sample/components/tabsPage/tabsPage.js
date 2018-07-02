import NotesPage from '@/components/notesPage/NotesPage';
import SplitterPage from '@/components/splitterPage/SplitterPage';
import CarouselPage from '@/components/carousel/Carousel';
import Dialogs from '@/components/dialogs/Dialogs';
import GoingPage from '@/components/goingPage/GoingPage';

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
