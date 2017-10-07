'use strict';

const _ = require('lodash');
const assert = require('assert');
const Platio = require('./platio');

const maxLimit = 100;

class Fetcher {
    constructor(node) {
        this.node = node;
    }

    /* istanbul ignore next */
    fetch(msg, callback) {
        assert(false);
    }
}

class SingleRecordFetcher extends Fetcher {
    fetch(msg, callback) {
        this.node.sendRequest({
            method: 'GET'
        }, msg, callback);
    }
}

class MultiRecordsFetcher extends Fetcher {
    fetch(msg, callback) {
        const requestParameters = _.defaultTo(msg.platio, {});
        const limit = this.node.getProperty(requestParameters, 'limit', 0);
        return this._fetch(msg, requestParameters, limit, [], callback);
    }

    _fetch(msg, requestParameters, limit, fetchedRecords, callback) {
        const thisLimit = Math.min(limit, maxLimit);
        const options = this._buildRequestOptions(requestParameters, fetchedRecords.length, thisLimit);
        this.node.sendRequest(options, msg, body => {
            const records = body;
            const allRecords = _.concat(fetchedRecords, records);
            const nextLimit = limit - records.length;
            if (records.length < thisLimit || nextLimit <= 0) {
                callback(allRecords);
            }
            else {
                this._fetch(msg, requestParameters, nextLimit, allRecords, callback);
            }
        });
    }

    _buildRequestOptions(requestParameters, skip, limit) {
        const params = [
            'sortKey',
            'sortOrder',
            'sortColumnId',
            'search',
            'timezone'
        ];
        const queryString = _.omitBy(_.zipObject(params, _.map(params, param => {
            return this.node.getProperty(requestParameters, param, '');
        })), _.isEmpty);
        if (limit > 0) {
            _.extend(queryString, {
                skip,
                limit
            });
        }

        return {
            method: 'GET',
            qs: queryString
        };
    }
}


module.exports = RED => {
    class PlatioIn extends Platio {
        constructor(config) {
            super(RED, config);
        }

        handleInput(msg) {
            const requestParameters = _.defaultTo(msg.platio, {});

            const recordId = this.getProperty(requestParameters, 'recordId', '');

            const Fetcher = !_.isEmpty(recordId) ? SingleRecordFetcher : MultiRecordsFetcher;
            const fetcher = new Fetcher(this);
            fetcher.fetch(msg, payload => {
                msg.payload = payload;
                this.send(msg);
            });
        }
    }

    RED.nodes.registerType('platio in', PlatioIn, {
        credentials: {
            authorization: {
                type: 'password'
            }
        }
    });
};
