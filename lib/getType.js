'use strict';

module.exports = getType;

var isArray = Array.isArray;
var isNull = require('lodash').isNull;
var isRegExp = require('lodash').isRegExp;
var isDate = require('lodash').isDate;

/**
 * Возвращает нормализованный тип объекта
 *
 * @param {*} arg
 * @return {string}
 */
function getType(arg) {
    if (typeof arg !== 'object') {
        return typeof arg;
    }

    switch (true) {
    case isArray(arg):
        return 'array';

    case isNull(arg):
        return 'null';

    case isRegExp(arg):
        return 'regexp';

    case isDate(arg):
        return 'date';
    }

    return 'object';
}
