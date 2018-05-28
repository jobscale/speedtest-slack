'use strict';
const {App} = require('modules/common/index');
const _ = require('lodash');
class Slack extends App {
    constructor(env) {
        super();
        this.env = _.cloneDeep(env);
        this.method = 'POST';
        this.url = `https://hooks.slack.com/services/${this.env.access}`;
    }
    send(json) {
        return this.fetch(this.url, {method: this.method, body: JSON.stringify(json)})
        .then(response => ((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return {status: response.status, statusText: response.statusText};
        })(response))
        .catch(e => e.message);
    }
}
module.exports = {
    Slack: Slack
};