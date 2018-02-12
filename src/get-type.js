// @flow

const TYPE_REGEX = /\s([a-zA-Z]+)/;

/**
 * Returns type of `arg`
 *
 * @param {*} arg
 * @return {string}
 */
export default function getType(arg: mixed): string {
    if (arg === null) {
        return 'null';
    } else if (arg === void 0) {
        return 'undefined';
    }

    const groups = Object.prototype.toString.call(arg).match(TYPE_REGEX);

    if (!Array.isArray(groups)) {
        throw new Error(`Unexpected type of arg ${String(arg)}`);
    }

    return groups[1].toLowerCase();
}
