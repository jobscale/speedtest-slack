const env = require('env');
const { Slack } = require('slack');

const main = () => {
  const slack = new Slack(env.slack);
  slack.getHistory(1000)
  .then(json => slack.deleteChat(json.messages))
  .catch(e => logger.error(e.message))
  .then(json => logger.info(json));
};
(() => {
  main();
})();
