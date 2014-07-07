!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.superoverload=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

module.exports = _dereq_('./lib/overload');

},{"./lib/overload":3}],2:[function(_dereq_,module,exports){
'use strict';

module.exports = getType;

/**
 * Возвращает нормализованный тип объекта
 *
 * @param {*} arg
 * @return {string}
 */
function getType(arg) {
    return ({}).toString.call(arg).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

},{}],3:[function(_dereq_,module,exports){
'use strict';


var getType = _dereq_('./getType');
var pair = _dereq_('./pair');
module.exports = overload;

function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
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

},{"./getType":2,"./pair":4}],4:[function(_dereq_,module,exports){
'use strict';

module.exports = pair;

/**
 * Разбивает массив по парам [0, 1, 2, 3] => [[0, 1], [2, 3]]
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