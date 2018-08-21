import { Util as u } from '@/modules/util';

export default {
  props: ['callback', 'text'],
  methods: {
    translate: u.translate,
  },
};
