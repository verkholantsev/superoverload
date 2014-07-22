'use strict';

module.exports = getType;

var TYPE_REGEX = /\s([a-zA-Z]+)/;

/**
 * Returns normalized type of `arg`
 *
 * @param {*} arg
 * @return {string}
 */
function getType(arg) {
    return Object.prototype.toString.call(arg).match(TYPE_REGEX)[1].toLowerCase();
}
