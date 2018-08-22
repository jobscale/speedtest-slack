const { App } = require('common');
const weather = require('weather-js');

class Weather extends App {
  find(search) {
    const promise = this.makePromise();
    weather.find({ search, degreeType: 'C' }, (e, res) => {
      if (e) {
        this.logger.error(e);
        promise.reject(e);
      } else {
        promise.resolve(res);
      }
    });
    return promise.instance;
  }
}
module.exports = {
  Weather,
};
