// @flow

/**
 * Transforms array into array of pairs [0, 1, 2, 3] => [[0, 1], [2, 3]]
 *
 * @param {array} array
 * @return {array}
 */
export default function pair<T>(array: Array<T>): Array<Array<T>> {
    return array.reduce((result, element, i) => {
        i = parseInt(i / 2, 10);
        result[i] = result[i] || [];
        result[i].push(element);
        return result;
    }, []);
}
