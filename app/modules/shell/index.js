const { App } = require('common');
const shell = require('child_process');

class Shell extends App {
  exec(cmd) {
    const promise = this.makePromise();
    shell.exec(cmd, (e, stdout) => e ? promise.reject(e) : promise.resolve(stdout));
    return promise.instance;
  }
}
module.exports = {
  Shell,
};
