!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.superoverload=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

module.exports = _dereq_('./lib/overload');

},{"./lib/overload":3}],2:[function(_dereq_,module,exports){
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

},{}],3:[function(_dereq_,module,exports){
'use strict';

var getType = _dereq_('./getType');
var pair = _dereq_('./pair');

module.exports = overload;

/**
 *
 * @param {array} array
 * @return {string}
 */
function serializeSignature(array) {
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
 * var fn = overload(
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
 * var fn = overload(
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
    var args = new Array(arguments.length);

    for(var i = 0, len = args.length; i < len; i++) {
        args[i] = arguments[i];
    }

    var defaultFn = args.length % 2 > 0 ? args.shift() : null;
    var pairs = pair(args);
    var fns = new Array(pairs.length);
    var longestSignature = [];

    var ifs = pairs
        .map(function(pair, index) {
            var sample = 'if (hashKey === "%signature%") { return fns[%index%].call(this, %args%); }';
            var signature = pair[0];
            var fn = pair[1];
            var hashKey = signature.join(', ');

            fns[index] = fn;
            if (signature.length > longestSignature.length) {
                longestSignature = signature;
            }

            return sample
                .replace('%signature%', hashKey)
                .replace('%index%', index)
                .replace('%args%', serializeSignature(signature));
        })
        .join(' else ');

    var serializedSignature = serializeSignature(longestSignature);
    var code = [
            'return function(' + serializedSignature + ') {',
                'var hashKey = "";',
                'for (var i = 0, len = arguments.length; i < len; i++) {',
                    'hashKey += getType(arguments[i]);',
                    'if (i !== len - 1) {',
                        'hashKey += ", ";',
                    '}',
                '}',
                ifs,

                pairs.length > 0 ? ' else { ' : '',

                'if (!defaultFn) {',
                    'throw new Error(\'No matching function for call with signature "\' + hashKey + \'"\');',
                '}',

                pairs.length > 0 ? '}' : '',
                'return defaultFn.apply(this, arguments);',
            '}'
        ];

    /* jshint evil: true */
    var superFunc = new Function('getType, fns, defaultFn', code.join(''));
    /* jshint evil: false */

    return superFunc(getType, fns, defaultFn);
}

},{"./getType":2,"./pair":4}],4:[function(_dereq_,module,exports){
'use strict';

module.exports = pair;

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

},{}]},{},[1])
(1)
});