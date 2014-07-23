'use strict';

var getType = require('./getType');
var pair = require('./pair');

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
 * Реализация перегрузки функций
 *
 * В качестве аргументов принимает сигнатуры и функции, например так:
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
 * Возвращает функцию, которая при вызове ее с какими-либо аргументами,
 * вызовет функцию с подходящей сигнатурой
 *
 * Первым аргументом можно передать функцию, которая будет вызвана,
 * если ни одна из сигнатур на подойдет под текущий вызов, например так:
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

    for(var i = 0; i < args.length; i++) {
                //i is always valid index in the arguments object
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
                'return defaultFn.call(this, ' + (serializedSignature || 'null') + ');',
            '}'
        ];

    /* jshint evil: true */
    var superFunc = new Function('getType, fns, defaultFn', code.join(''));
    /* jshint evil: false */

    return superFunc(getType, fns, defaultFn);
}
