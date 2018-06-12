/**
 * トップページ
 */
class Index extends Page {
    constructor() {
        super();
    }
    /**
     * ページの初期化
     */
    initialize() {
        this.initElement();
        this.initAction();
    }
    /**
     * 表示項目の初期化
     */
    initElement() {
    }
    /**
     * アクションイベントの初期化
     */
    initAction() {
    }
    /**
     * デバイス利用可能のイベント
     */
    onDeviceReady() {
        this.initialize();
    }
}
/**
 * Vue
 */
ons.ready(() => {
    const app = new Index();
    const customToolbar = {
        template: '#toolbar',
        props: ['title', 'action']
    };
    const homePage = {
        template: '#home',
        props: ['toggleMenu'],
        components: { customToolbar },
        data() {
            return {
                nextButtonTitle: 'つぎのページ'
            };
        },
        methods: {
            goFirst() {
                app.movePage('pages/first/first.html');
            }
        }
    };
    const newsPage = {
        template: '#news',
        props: ['toggleMenu'],
        components: { customToolbar }
    };
    const settingsPage = {
        template: '#settings',
        props: ['toggleMenu'],
        components: { customToolbar }
    };
    new Vue({
        el: '#app',
        template: '#main',
        data() {
            return {
                currentPage: 'home',
                pages: ['home', 'news', 'settings'],
                openSide: false
            };
        },
        components: {
            home: homePage,
            news: newsPage,
            settings: settingsPage,
        }
    });
});
