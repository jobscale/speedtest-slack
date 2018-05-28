'use strict';
const {App} = require('modules/common/index');
const {Shell} = require('modules/shell/index');
class SpeedTest extends App {
    constructor() {
        super();
        this.cmd = 'speedtest-cli --simple --share';
    }
    run() {
        return new Shell().exec(this.cmd)
        .then(res => res)
        .catch(e => e.message);
    }
}
module.exports = {
    SpeedTest: SpeedTest
};