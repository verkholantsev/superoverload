'use strict';

module.exports = getType;

/**
 * Returns normalized type of `arg`
 *
 * @param {*} arg
 * @return {string}
 */
function getType(arg) {
    return ({}).toString.call(arg).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}
