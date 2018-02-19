// @flow

import getType from './get-type';
import pair from './pair';
import serializeSignature from './serialize-signature';
import getUnsupportedTypes from './get-unsupported-types';

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
 */
export default function overload(...args: Array<*>): Function {
    const defaultFn = args.length % 2 > 0 ? args.shift() : null;
    const pairs = pair(args);

    const ifsArray = new Array(pairs.length);
    const fns = new Array(pairs.length);
    let longestSignature = [];

    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i];
        const signature = pair[0];
        const fn = pair[1];

        const unsupportedTypes = getUnsupportedTypes(signature);
        if (unsupportedTypes.length > 0) {
            throw new Error(
                `Signature "${signature.join(', ')}" contains unsupported types: "${unsupportedTypes.join(', ')}"`
            );
        }

        const hashKey = signature.join(', ');
        fns[i] = fn;

        if (signature.length > longestSignature.length) {
            longestSignature = signature;
        }

        ifsArray[i] = `
if (hashKey === '${hashKey}') {
    return fns[${String(i)}].call(this, ${serializeSignature(signature)});
}`;
    }

    const ifs = ifsArray.join(' else ');

    const serializedSignature = serializeSignature(longestSignature);
    const code = `
return function overloadedFn(${serializedSignature}) {
    var hashKey = '';
    var len = arguments.length;
    var args = new Array(len);

    for (var i = 0; i < len; i++) {
        args[i] = arguments[i];
    }

    for (var i = 0; i < len; i++) {
        hashKey += getType(args[i]);
        if (i !== len - 1) {
            hashKey += ', ';
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
