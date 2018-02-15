// @flow

/**
 *
 * @param {array} array
 * @return {string}
 */
export default function serializeSignature(array: Array<*>): string {
    return array
        .map(function(arg, index) {
            return '_' + index;
        })
        .join(',');
}
