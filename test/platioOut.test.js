'use strict';

const should = require('should');
require('should-sinon');
const sinon = require('sinon');

describe('PlatioOut', () => {
    let RED;
    let PlatioOut;

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
                    PlatioOut = Node;
                }
            }
        };
        require('../src/platioOut')(RED);
    });

    it('should make it an error when the payload is not an object', () => {
        const platioOut = new PlatioOut({});
        const msg = {};
        platioOut.handleInput(msg);
        platioOut.error.should.be.calledWithExactly('Invalid payload', msg);
    });

    it('should send a message if it creates a new record', () => {
        const platioOut = new PlatioOut({
            applicationId: 'applicationId',
            collectionId: 'collectionId'
        });
        platioOut.credentials = {
            authorization: 'token'
        };

        const payload = {
            values: {
                c1234567: {
                    type: 'String',
                    value: 'test'
                }
            }
        };
        const msg = {
            payload
        };
        const responseBody = {
            id: 'r12345678901234567890123456'
        };
        sinon.stub(platioOut, 'sendRequest').yields(responseBody);
        platioOut.handleInput(msg);
        platioOut.send.should.be.calledWithExactly({
            payload: responseBody
        });
        platioOut.sendRequest.should.be.calledWithExactly({
            method: 'POST',
            body: payload,
        }, msg, sinon.match.func);
    });

    it('should send a message if it updates an existing record', () => {
        const platioOut = new PlatioOut({
            applicationId: 'applicationId',
            collectionId: 'collectionId',
            recordId: 'recordId'
        });
        platioOut.credentials = {
            authorization: 'token'
        };

        const payload = {
            values: {
                c1234567: {
                    type: 'String',
                    value: 'test'
                }
            }
        };
        const msg = {
            payload
        };
        const responseBody = {
            id: 'r12345678901234567890123456'
        };
        sinon.stub(platioOut, 'sendRequest').yields(responseBody);
        platioOut.handleInput(msg);
        platioOut.send.should.be.calledWithExactly({
            payload: responseBody
        });
        platioOut.sendRequest.should.be.calledWithExactly({
            method: 'PUT',
            body: payload,
        }, msg, sinon.match.func);
    });

    it('should send a message if it deletes an existing record', () => {
        const platioOut = new PlatioOut({
            applicationId: 'applicationId',
            collectionId: 'collectionId',
            recordId: 'recordId',
            delete: true
        });
        platioOut.credentials = {
            authorization: 'token'
        };

        const payload = {
            values: {
                c1234567: {
                    type: 'String',
                    value: 'test'
                }
            }
        };
        const msg = {
            payload
        };
        const responseBody = '';
        sinon.stub(platioOut, 'sendRequest').yields(responseBody);
        platioOut.handleInput(msg);
        platioOut.send.should.be.calledWithExactly({
            payload: responseBody
        });
        platioOut.sendRequest.should.be.calledWithExactly({
            method: 'DELETE',
        }, msg, sinon.match.func);
    });
});
