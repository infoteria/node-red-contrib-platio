'use strict';

const _ = require('lodash');
const assert = require('assert');
const request = require('request');
require('./compat');

class Platio {
    constructor(RED, config) {
        RED.nodes.createNode(this, config);

        this._config = config;

        this.on('input', _.bind(this.handleInput, this));
    }

    /* istanbul ignore next */
    handleInput(msg) {
        assert(false);
    }

    sendRequest(options, msg, callback) {
        const baseURL = 'https://api.plat.io/v1';

        const requestParameters = _.defaultTo(msg.platio, {});
        const applicationId = this.getProperty(requestParameters, 'applicationId', '');
        const collectionId = this.getProperty(requestParameters, 'collectionId', '');
        const recordId = this.getProperty(requestParameters, 'recordId', '');

        let url = `${baseURL}/${applicationId}/collections/${collectionId}/records`;
        if (!_.isEmpty(recordId)) {
            url += `/${recordId}`;
        }

        return request(_.extend({
            url,
            headers: {
                Authorization: this.getCredential(requestParameters, 'authorization', '')
            },
            json: true,
        }, options), (error, response, body) => {
            if (error) {
                this.error(error, msg);
            }
            else if (200 <= response.statusCode && response.statusCode <= 300) {
                callback(body);
            }
            else {
                this.error(this._getErrorMessage(body), msg);
            }
        });
    }

    getProperty(requestParameters, name, defaultValue) {
        return _.defaultTo(_.defaultTo(requestParameters[name], this._config[name]), defaultValue);
    }

    getCredential(requestParameters, name, defaultValue) {
        return _.defaultTo(_.defaultTo(requestParameters[name], _.get(this.credentials, name)), defaultValue);
    }

    _getErrorMessage(body) {
        if (_.isObject(body)) {
            return _.defaultTo(body.code, 'Unknown error');
        }
        else if (!_.isNil(body)) {
            return body.toString();
        }
        else {
            return 'Unknown error';
        }
    }

    static register(RED, name, clazz) {
        // With older versions of Node-RED such as 0.13.4,
        // RED.nodes.registerType replaces the prototype of
        // the prototype of the constructor.
        // So its prototype chain becomes Platio(In|Out) -> Node,
        // instead of Platio(In|Out) -> Platio -> Node.
        // We'll restore these prototypes here to fix this broken chain.
        // This will do nothing with the latest Node-RED (0.17.5).
        function restoringPrototypes(action) {
            const proto = Object.getPrototypeOf(clazz.prototype);

            action();

            const replacedProto = Object.getPrototypeOf(clazz.prototype);
            if (replacedProto !== proto) {
                Object.setPrototypeOf(proto, replacedProto);
                Object.setPrototypeOf(clazz.prototype, proto);
            }
        }

        restoringPrototypes(() => {
            RED.nodes.registerType(name, clazz, {
                credentials: {
                    authorization: {
                        type: 'password'
                    }
                }
            });
        });
    }
}

module.exports = Platio;
