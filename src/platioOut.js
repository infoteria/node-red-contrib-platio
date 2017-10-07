'use strict';

const _ = require('lodash');
const Platio = require('./platio');

module.exports = RED => {
    class PlatioOut extends Platio {
        constructor(config) {
            super(RED, config);
        }

        handleInput(msg) {
            const payload = msg.payload;
            if (!_.isObject(payload)) {
                return this.error('Invalid payload', msg);
            }

            const requestParameters = _.defaultTo(msg.platio, {});
            const options = this._buildRequestOptions(requestParameters, payload);
            this.sendRequest(options, msg, body => {
                msg.payload = body;
                this.send(msg);
            });
        }

        _buildRequestOptions(requestParameters, body) {
            const recordId = this.getProperty(requestParameters, 'recordId', '');
            const deleteRecord = this.getProperty(requestParameters, 'delete', false);

            if (_.isEmpty(recordId)) {
                return {
                    method: 'POST',
                    body
                };
            }
            else if (deleteRecord) {
                return {
                    method: 'DELETE'
                };
            }
            else {
                return {
                    method: 'PUT',
                    body
                };
            }
        }
    }

    RED.nodes.registerType('platio out', PlatioOut, {
        credentials: {
            authorization: {
                type: 'password'
            }
        }
    });
};
