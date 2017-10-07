'use strict';

const _ = require('lodash');

/* istanbul ignore next */
(() => {
    if (_.isUndefined(_.defaultTo)) {
        _.defaultTo = (value, defaultValue) => _.isUndefined(value) ? defaultValue : value;
    }

    if (_.isUndefined(_.omitBy)) {
        _.omitBy = _.omit;
    }

    if (_.isUndefined(_.concat)) {
        _.concat = (array, anotherArray) => [].concat(array, anotherArray);
    }

    if (_.isUndefined(_.isNil)) {
        _.isNil = value => _.isUndefined(value) || _.isNull(value);
    }
})();
