/**
 * ページ共通の基底クラス
 */
class Page {
    constructor() {
        ons.platform.select('ios');
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('pause', this.onPause, false);
        document.addEventListener('resume', this.onResume, false);
    }
    onDeviceReady() {
    }
    onPause() {
    }
    onResume() {
    }
    getDate(...argv) {
        return new Date(...argv).toLocaleDateString();
    }
    movePage(uri) {
        location.replace(uri);
    }
}