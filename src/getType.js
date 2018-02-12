'use strict';

const TYPE_REGEX = /\s([a-zA-Z]+)/;

/**
 * Returns type of `arg`
 *
 * @param {*} arg
 * @return {string}
 */
export default function getType(arg) {
    if (arg === null) {
        return 'null';
    } else if (arg === void 0) {
        return 'undefined';
    }
    return Object.prototype.toString
        .call(arg)
        .match(TYPE_REGEX)[1]
        .toLowerCase();
}
