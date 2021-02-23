require('core');
const { WebClient, LogLevel } = require('@slack/web-api');

const conf = {
  target: 'https://jsx.jp',
  cookie: 'X-AUTH=X0X0X0X0X0X0X0X',
  host: 'https://partner.credentials.svc.cluster.local',
};
if (process.env.NODE_ENV === 'LOCAL') {
  conf.host = 'https://jsx.jp:3443';
}

const delay = 1000;

class App {
  fetchEnv() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
    return fetch(`${conf.host}/slack.json`, {
      method: 'GET',
      headers: { Cookie: conf.cookie },
    })
    .then(res => res.json());
  }
  delayRemove(ts, slack, client) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(client.chat.delete({
          channel: slack.channel,
          ts,
        }));
      }, delay);
    });
  }
  async routine(slack) {
    const client = new WebClient(slack.token, {
      logLevel: LogLevel.DEBUG,
    });
    const res = { length: 'first' };
    for (; res.length;) {
      await client.conversations.history({
        channel: slack.channel,
      })
      .then(async json => {
        logger.info({ length: json.messages.length });
        res.length = json.messages.length;
        // eslint-disable-next-line
        for (const message of json.messages) {
          await this.delayRemove(message.ts, slack, client);
        }
      });
    }
  }
  start() {
    return this.fetchEnv()
    .then(slack => this.routine(slack))
    .catch(e => logger.error(e));
  }
}

new App().start();
