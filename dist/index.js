(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.superoverload = factory());
}(this, (function () { 'use strict';

var TYPE_REGEX = /\s([a-zA-Z]+)/;

/**
 * Returns normalized type of `arg`
 *
 * @param {*} arg
 * @return {string}
 */
function getType(arg) {
    if (arg === null) {
        return 'null';
    } else if (arg === void 0) {
        return 'undefined';
    }
    return Object.prototype.toString.call(arg).match(TYPE_REGEX)[1].toLowerCase();
}

/**
 * Transforms array into array of pairs [0, 1, 2, 3] => [[0, 1], [2, 3]]
 *
 * @param {array} array
 * @return {array}
 */

function pair(array) {
    return array.reduce(function (result, element, i) {
        i = parseInt(i / 2, 10);
        result[i] = result[i] || [];
        result[i].push(element);
        return result;
    }, []);
}

/**
 *
 * @param {array} array
 * @return {string}
 */
function serializeSignature(array) {
    return array.map(function (arg, index) {
        return '_' + index;
    }).join(',');
}

/**
 * Function overload implementation
 *
 * Takes signatures and functions as arguments, like this:
 *
 * const fn = overload(
 *     ['number'],
 *     function (a) { return 'It is a number'; },
 *
 *     ['string'],
 *     function (a) { return 'It is a string'; }
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
 *     function (a) { return 'It is something else'; },
 *
 *     ['number'],
 *     function (a) { return 'It is a number'; }
 * )
 *
 * fn(1); // => 'It is a number'
 * fn(''); // => 'It is something else'
 *
 * @return {function}
 */
function overload() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    var defaultFn = args.length % 2 > 0 ? args.shift() : null;
    var pairs = pair(args);
    var fns = new Array(pairs.length);
    var longestSignature = [];

    var ifs = pairs.map(function (pair$$1, index) {
        var sample = 'if (hashKey === "%signature%") { return fns[%index%].call(this, %args%); }';
        var signature = pair$$1[0];
        var fn = pair$$1[1];
        var hashKey = signature.join(', ');

        fns[index] = fn;
        if (signature.length > longestSignature.length) {
            longestSignature = signature;
        }

        return sample.replace('%signature%', hashKey).replace('%index%', index).replace('%args%', serializeSignature(signature));
    }).join(' else ');

    var serializedSignature = serializeSignature(longestSignature);
    var code = ['return function(' + serializedSignature + ') {', 'var hashKey = "";', 'for (var i = 0, len = arguments.length; i < len; i++) {', 'hashKey += getType(arguments[i]);', 'if (i !== len - 1) {', 'hashKey += ", ";', '}', '}', ifs, pairs.length > 0 ? ' else { ' : '', 'if (!defaultFn) {', 'throw new Error(\'No matching function for call with signature "\' + hashKey + \'"\');', '}', pairs.length > 0 ? '}' : '', 'return defaultFn.apply(this, arguments);', '}'];

    /* jshint evil: true */
    var superFunc = new Function('getType, fns, defaultFn', code.join(''));
    /* jshint evil: false */

    return superFunc(getType, fns, defaultFn);
}

return overload;

})));
