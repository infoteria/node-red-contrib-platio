'use strict';

const proxyquire = require('proxyquire');
const should = require('should');
const sinon = require('sinon');

describe('Platio', () => {
    let RED;
    let Platio;
    let request;

    beforeEach(() => {
        RED = {
            nodes: {
                createNode: (node, config) => {
                    node.credentials = {};
                    node.on = sinon.stub();
                    node.error = sinon.stub();
                },
                registerType: sinon.stub()
            }
        };
        request = sinon.stub();
        Platio = proxyquire('../src/platio', {
            request
        });
    });

    describe('sendRequest', () => {
        it('should send a request to records', () => {
            const platio = new Platio(RED, {});
            const response = {
                statusCode: 204
            };
            const body = {
                test: 'value'
            };
            request.yields(null, response, body);
            const callback = sinon.stub();
            platio.sendRequest({
                method: 'POST',
                body: {
                    foo: 'bar'
                }
            }, {
                platio: {
                    applicationId: 'applicationId',
                    collectionId: 'collectionId',
                    authorization: 'token'
                }
            }, callback);

            request.should.be.calledWithExactly({
                url: 'https://api.plat.io/v1/applicationId/collections/collectionId/records',
                method: 'POST',
                headers: {
                    Authorization: 'token'
                },
                body: {
                    foo: 'bar'
                },
                json: true
            }, sinon.match.func);
            callback.should.be.calledWithExactly(body);
        });

        it('should send a request to a record', () => {
            const platio = new Platio(RED, {});
            const response = {
                statusCode: 200
            };
            const body = {
                test: 'value'
            };
            request.yields(null, response, body);
            const callback = sinon.stub();
            platio.sendRequest({
                method: 'GET',
            }, {
                platio: {
                    applicationId: 'applicationId',
                    collectionId: 'collectionId',
                    recordId: 'recordId',
                    authorization: 'token'
                }
            }, callback);

            request.should.be.calledWithExactly({
                url: 'https://api.plat.io/v1/applicationId/collections/collectionId/records/recordId',
                method: 'GET',
                headers: {
                    Authorization: 'token'
                },
                json: true
            }, sinon.match.func);
            callback.should.be.calledWithExactly(body);
        });

        it('should call this.error if error', () => {
            const platio = new Platio(RED, {});
            const error = new Error('error');
            request.yields(error);
            const msg = {
                platio: {
                    applicationId: 'applicationId',
                    collectionId: 'collectionId',
                    authorization: 'token'
                }
            };
            const callback = sinon.stub();
            platio.sendRequest({
                method: 'POST',
                body: {
                    foo: 'bar'
                }
            }, msg, callback);

            callback.should.not.be.called();
            platio.error.should.be.calledWithExactly(error, msg);
        });

        it('should call this.error if failure response', () => {
            const platio = new Platio(RED, {});
            const response = {
                statusCode: 404
            };
            const body = {
                code: 'APPLICATION_NOT_FOUND'
            };
            request.yields(null, response, body);
            const msg = {
                platio: {
                    applicationId: 'applicationId',
                    collectionId: 'collectionId',
                    authorization: 'token'
                }
            };
            const callback = sinon.stub();
            platio.sendRequest({
                method: 'POST',
                body: {
                    foo: 'bar'
                }
            }, msg, callback);

            callback.should.not.be.called();
            platio.error.should.be.calledWithExactly('APPLICATION_NOT_FOUND', msg);
        });
    });

    describe('getProperty', () => {
        it('should return a property from request parameters', () => {
            const platio = new Platio(RED, {});
            platio.getProperty({
                name: 'test',
            }, 'name', 'default').should.equal('test');
        });

        it('should return a property from config', () => {
            const platio = new Platio(RED, {
                name: 'test'
            });
            platio.getProperty({}, 'name', 'default').should.equal('test');
        });

        it('should return a default value', () => {
            const platio = new Platio(RED, {});
            platio.getProperty({}, 'name', 'default').should.equal('default');
        });
    });

    describe('getCredential', () => {
        it('should return a credential from request parameters', () => {
            const platio = new Platio(RED, {});
            platio.getCredential({
                authorization: 'test',
            }, 'authorization', 'default').should.equal('test');
        });

        it('should return a credential from config', () => {
            const platio = new Platio(RED, {});
            platio.credentials = {
                authorization: 'test'
            };
            platio.getCredential({}, 'authorization', 'default').should.equal('test');
        });

        it('should return a default value', () => {
            const platio = new Platio(RED, {});
            platio.getCredential({}, 'authorization', 'default').should.equal('default');
        });

        it('should return a default value if credentials is undefined', () => {
            const platio = new Platio(RED, {});
            platio.credentials = undefined;
            platio.getCredential({}, 'authorization', 'default').should.equal('default');
        });
    });

    describe('_getErrorMessage', () => {
        let platio;

        beforeEach(() => {
            platio = new Platio(RED, {});
        });

        it('should return code if body is an object', () => {
            platio._getErrorMessage({
                code: 'APPLICATION_NOT_FOUND'
            }).should.equal('APPLICATION_NOT_FOUND');
        });

        it('should return Unknown error if no code', () => {
            platio._getErrorMessage({}).should.equal('Unknown error');
        });

        it('should return the body itself if not nil', () => {
            platio._getErrorMessage('Error').should.equal('Error');
        });

        it('should return Unknown error if nil', () => {
            platio._getErrorMessage(undefined).should.equal('Unknown error');
        });
    });

    describe('register', () => {
        it('should call registerType with credentials', () => {
            class Test {}

            Platio.register(RED, 'test', Test);

            RED.nodes.registerType.should.be.calledWithExactly('test', Test, {
                credentials: {
                    authorization: {
                        type: 'password'
                    }
                }
            });
        });

        it('should restore prototype chain if it\'s broken', () => {
            class Base {}
            class Derived extends Base {}
            const base = Object.getPrototypeOf(Derived.prototype);
            class Node {}
            const node = new Node();
            RED.nodes.registerType.callsFake((name, constructor, options) => {
                Object.setPrototypeOf(constructor.prototype, node);
            });

            Platio.register(RED, 'test', Derived);

            Object.getPrototypeOf(Derived.prototype).should.equal(base);
            Object.getPrototypeOf(base).should.equal(node);
        });
    });
});
