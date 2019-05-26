const env = require('env');
const { Slack } = require('slack');

const main = () => {
  const slack = new Slack(env.slack);
  slack.getHistory(1)
  .then(json => logger.info(json))
  .catch(e => logger.error(e.message))
  .then(() => logger.info('finish.'));
};
(() => {
  main();
})();
