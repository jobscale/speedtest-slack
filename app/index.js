const _ = require('lodash');
const env = require('env');
const { SpeedTest } = require('speedtest');
const { Slack } = require('slack');
const { Weather } = require('weather');

const datas = [{
  icon_emoji: ':email:',
  username: 'Speed',
  attachments: [{
    fallback: '',
  }],
}];
const getUrls = text => {
  const search = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g;
  return text.match(search);
};
const getData = text => {
  const data = _.cloneDeep(datas[0]);
  data.text = text;
  data.attachments = [{
    fallback: '',
    thumb_url: getUrls(text)[0],
  }];
  return data;
};
const main = () => {
  const slack = new Slack(env.slack);
  let text;
  new SpeedTest().run()
  .then(res => getData(text = res))
  .then(data => slack.send(data))
  .then(() => new Weather().find('Osaka, Japan'))
  .then(res => res.forEach(async data => {
    const d = data.current;
    const t = `${d.skytext} ${d.temperature}℃ / ${d.humidity}％ ${d.winddisplay} <${d.imageUrl}|icon>`;
    await slack.send(getData(t));
  }))
  .then(() => new Weather().run())
  .then(res => slack.send(getData(`${res.caption} - ${res.date} <${res.image}|icon>`)))
  .then(res => slack.logger.info(text, res));
};
(() => {
  main();
})();
