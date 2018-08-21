import { Util as u } from '@/modules/util';

export default {
  props: ['action'],
  data() {
    return {
      isExpanded: false,
      isCollapse: true,
      isDropped: false,
    };
  },
  methods: {
    translate: u.translate,
    prompt() {
      this.$ons.notification.prompt({
        title: '保存',
        messageHTML: this.$el.querySelector('#manage-prompt').innerHTML,
        placeholder: '標準の初期設定',
        buttonLabels: ['キャンセル', '保存'],
        callback: name => name !== null && this.save(),
      });
    },
    save(name) {
      if (name) {
        this.$ons.notification.toast(`「${name}」を保存しました。`, { timeout: 3000 });
      } else {
        this.prompt();
      }
    },
  },
};
