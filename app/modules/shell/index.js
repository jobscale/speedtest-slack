'use strict';
const {App} = require('common');
const shell = require('child_process');
class Shell extends App {
    constructor() {
        super();
    }
    exec(cmd) {
        let promise = this.makePromise();
        shell.exec(cmd, (e, out, err) => {
            e ? promise.reject(e) : promise.resolve(out);
        });
        return promise.instance;
    }
}
module.exports = {
    Shell: Shell
};