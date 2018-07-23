const env = require('env');
const { Slack } = require('slack');

const main = () => {
  const slack = new Slack(env.slack);
  slack.getHistory(1)
  .then(json => slack.logger.info(json))
  .catch(e => slack.logger.error(e.message))
  .then(() => slack.logger.info('finish.'));
};
(() => {
  main();
})();
