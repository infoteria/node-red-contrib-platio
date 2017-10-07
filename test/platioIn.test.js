'use strict';

const _ = require('lodash');
const should = require('should');
require('should-sinon');
const sinon = require('sinon');

describe('PlatioIn', () => {
    let RED;
    let PlatioIn;

    beforeEach(() => {
        RED = {
            nodes: {
                createNode: (node, config) => {
                    node.credentials = {};
                    node.on = sinon.stub();
                    node.send = sinon.stub();
                    node.error = sinon.stub();
                },
                registerType: (name, Node, options) => {
                    PlatioIn = Node;
                }
            }
        };
        require('../src/platioIn')(RED);
    });

    describe('Single record', () => {
        let platioIn;

        beforeEach(() => {
            platioIn = new PlatioIn({
                applicationId: 'applicationId',
                collectionId: 'collectionId',
                recordId: 'recordId'
            });
            platioIn.credentials = {
                authorization: 'token'
            };
        });

        it('should send a message if it retrieves a record', () => {
            const msg = {};
            const responseBody = {
                id: 'r12345678901234567890123456'
            };
            sinon.stub(platioIn, 'sendRequest').yields(responseBody);
            platioIn.handleInput(msg);
            platioIn.send.should.be.calledWithExactly({
                payload: responseBody
            });
            platioIn.sendRequest.should.be.calledWithExactly({
                method: 'GET',
            }, msg, sinon.match.func);
        });
    });


    describe('Multiple records', () => {
        let platioIn;

        beforeEach(() => {
            platioIn = new PlatioIn({
                applicationId: 'applicationId',
                collectionId: 'collectionId',
            });
            platioIn.credentials = {
                authorization: 'token'
            };
        });

        it('should send a message if it retrieves records', () => {
            const msg = {
                platio: {
                    sortKey: 'column',
                    sortOrder: 'ascending',
                    sortColumnId: 'columnId',
                    search: 'Search',
                    timezone: 'Asia/Tokyo'
                }
            };
            const responseBody = [
                {
                    id: 'r12345678901234567890123456'
                }
            ];
            sinon.stub(platioIn, 'sendRequest').yields(responseBody);
            platioIn.handleInput(msg);
            platioIn.send.should.be.calledWithExactly({
                payload: responseBody,
                platio: msg.platio
            });
            platioIn.sendRequest.should.be.calledWithExactly({
                method: 'GET',
                qs: {
                    sortKey: 'column',
                    sortOrder: 'ascending',
                    sortColumnId: 'columnId',
                    search: 'Search',
                    timezone: 'Asia/Tokyo'
                }
            }, msg, sinon.match.func);
        });

        it('should retrieve records only once without limit', () => {
            const msg = {};
            const responseBody = _.times(100, _.constant({
                id: 'r12345678901234567890123456'
            }));
            sinon.stub(platioIn, 'sendRequest').yields(responseBody);
            platioIn.handleInput(msg);
            platioIn.send.should.be.calledWithExactly({
                payload: responseBody
            });
            platioIn.sendRequest.should.be.calledOnce();
            platioIn.sendRequest.should.be.calledWithExactly({
                method: 'GET',
                qs: {}
            }, msg, sinon.match.func);
        });

        it('should retrieve records repeatedly', () => {
            const msg = {
                platio: {
                    limit: 120
                }
            };
            const responseBody1 = _.times(100, _.constant({
                id: 'r12345678901234567890123456'
            }));
            const responseBody2 = _.times(20, _.constant({
                id: 'r12345678901234567890123456'
            }));
            const sendRequest = sinon.stub(platioIn, 'sendRequest');
            sendRequest.onFirstCall().yields(responseBody1);
            sendRequest.onSecondCall().yields(responseBody2);
            platioIn.handleInput(msg);
            platioIn.send.should.be.calledWithExactly({
                payload: _.concat(responseBody1, responseBody2),
                platio: msg.platio
            });
            sendRequest.should.be.calledTwice();
            sendRequest.should.be.calledWithExactly({
                method: 'GET',
                qs: {
                    skip: 0,
                    limit: 100
                }
            }, msg, sinon.match.func);
            sendRequest.should.be.calledWithExactly({
                method: 'GET',
                qs: {
                    skip: 100,
                    limit: 20
                }
            }, msg, sinon.match.func);
        });

        it('should stop retrieving records if there are no more records', () => {
            const msg = {
                platio: {
                    limit: 120
                }
            };
            const responseBody1 = _.times(100, _.constant({
                id: 'r12345678901234567890123456'
            }));
            const responseBody2 = _.times(10, _.constant({
                id: 'r12345678901234567890123456'
            }));
            const sendRequest = sinon.stub(platioIn, 'sendRequest');
            sendRequest.onFirstCall().yields(responseBody1);
            sendRequest.onSecondCall().yields(responseBody2);
            platioIn.handleInput(msg);
            platioIn.send.should.be.calledWithExactly({
                payload: _.concat(responseBody1, responseBody2),
                platio: msg.platio
            });
            sendRequest.should.be.calledTwice();
            sendRequest.should.be.calledWithExactly({
                method: 'GET',
                qs: {
                    skip: 0,
                    limit: 100
                }
            }, msg, sinon.match.func);
            sendRequest.should.be.calledWithExactly({
                method: 'GET',
                qs: {
                    skip: 100,
                    limit: 20
                }
            }, msg, sinon.match.func);
        });
    });
});
