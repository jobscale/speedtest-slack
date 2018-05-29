'use strict';
const {App} = require('common');
const FormData = require('form-data');
const _ = require('lodash');
class Slack extends App {
    constructor(env) {
        super();
        this.env = _.cloneDeep(env);
        this.method = 'POST';
    }
    send(param) {
        let url = `https://hooks.slack.com/services/${this.env.access}`;
        let body = JSON.stringify(param, null, 2);
        return this.fetch(url, {method: this.method, body: body})
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return body;
        })
        .catch(e => e.message);
    }
    getHistory(count) {
        let url = 'https://slack.com/api/channels.history';
        let param = _.cloneDeep(this.env);
        delete param.access;
        param.count = count;
        let form = new FormData();
        form.append('token', param.token);
        form.append('channel', param.channel);
        form.append('count', param.count);
        return this.fetch(url, {method: this.method, body: form})
        .then((response) => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
        .catch(e => e.message);
    }
    deleteMessage(app) {
        let url = 'https://slack.com/api/chat.delete';
        let message = app.messages.shift();
        let param = _.cloneDeep(app.env);
        delete param.access;
        param.ts = message.ts;
        let form = new FormData();
        form.append('token', param.token);
        form.append('channel', param.channel);
        form.append('ts', param.ts);
        return app.fetch(url, {method: app.method, body: form})
        .then((response) => {
            if (app.messages && app.messages.length) {
                setTimeout(app.deleteMessage, 1000, app);
            }
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json()
            .then((json) => {
                console.log(json);
                return json;
            });
        });
    }
    deleteChat(messages) {
        if (!messages || !messages.length) {
            return Promise.resolve({isEmpty: true});
        }
        this.messages = messages;
        this.deleteMessage(this);
    }
}
module.exports = {
    Slack: Slack
};