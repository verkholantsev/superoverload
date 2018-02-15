// @flow

/**
 * Transforms array into array of pairs [0, 1, 2, 3] => [[0, 1], [2, 3]]
 *
 * @param {array} array
 * @return {array}
 */
export default function pair<T>(array: Array<T>): Array<Array<T>> {
    const result = [];

    for (var i = 0, len = array.length; i < len; i++) {
        const element = array[i];
        const index = Math.floor(i / 2);
        result[index] = result[index] || [];
        result[index].push(element);
    }

    return result;
}
