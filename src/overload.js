// @flow

import getType from './get-type';
import pair from './pair';

/**
 *
 * @param {array} array
 * @return {string}
 */
function serializeSignature(array: Array<*>): string {
    return array
        .map(function(arg, index) {
            return '_' + index;
        })
        .join(',');
}

/**
 * Function overload implementation
 *
 * Takes signatures and functions as arguments, like this:
 *
 * const fn = overload(
 *     ['number'],
 *     a =>'It is a number',
 *
 *     ['string'],
 *     a => 'It is a string'
 * )
 *
 * fn(1); // => 'It is a number'
 * fn(''); // => 'It is a string'
 *
 * Returns an overloaded function, that will call the function with corresponding signature
 *
 * Fallback function can be passed as a first argument, like this:
 *
 * const fn = overload(
 *     a => 'It is something else',
 *
 *     ['number'],
 *     a => 'It is a number'
 * )
 *
 * fn(1); // => 'It is a number'
 * fn(''); // => 'It is something else'
 *
 * @return {function}
 */
export default function overload(...args: Array<*>): Function {
    const defaultFn = args.length % 2 > 0 ? args.shift() : null;
    const pairs = pair(args);
    const fns = new Array(pairs.length);
    let longestSignature = [];

    const ifs = pairs
        .map((pair, index) => {
            const sample = 'if (hashKey === "%signature%") { return fns[%index%].call(this, %args%); }';
            const signature = pair[0];
            const fn = pair[1];
            const hashKey = signature.join(', ');

            fns[index] = fn;
            if (signature.length > longestSignature.length) {
                longestSignature = signature;
            }

            return sample
                .replace('%signature%', hashKey)
                .replace('%index%', String(index))
                .replace('%args%', serializeSignature(signature));
        })
        .join(' else ');

    const serializedSignature = serializeSignature(longestSignature);
    const code = `return function(${serializedSignature}) {
    var hashKey = '';
    for (var i = 0, len = arguments.length; i < len; i++) {
        hashKey += getType(arguments[i]);
        if (i !== len - 1) {
            hashKey += ", ";
        }
    }
    ${ifs}
    ${pairs.length > 0 ? 'else {' : ''}
    if (!defaultFn) {
        throw new Error('No matching function for call with signature "' + hashKey + '"');
    }
    ${pairs.length > 0 ? '}' : ''}
    return defaultFn.apply(this, arguments);
}`;

    const superFunc = new Function('getType, fns, defaultFn', code);

    // $FlowFixMe errors with `new Function(...)`
    return superFunc(getType, fns, defaultFn);
}