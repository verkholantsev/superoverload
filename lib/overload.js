'use strict';


var toArray = require('lodash').toArray;
var getType = require('./getType');
var pair = require('./pair');
module.exports = overload;

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
    var args = toArray(arguments);
    if (args.length % 2 > 0) {
        var defaultFn = args.shift();
    }
    var pairs = pair(args);
    return function () {
        var args = toArray(arguments);
        var pair = pairs.filter(function (pair) {
            var signature = pair[0];
            return args.length === signature.length && args.every(function (arg, index) {
                return getType(arg) === signature[index];
            });
        })[0];
        if (!pair) {
            if (!defaultFn) {
                var description = args.map(getType).join(', ');
                throw new Error('No matching function for call with signature "' + description + '"');
            }

            return defaultFn.apply(this, arguments);
        }
        var fn = pair[1];
        return fn.apply(this, arguments);
    };
}
