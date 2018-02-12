'use strict';

import overload from '../src';

/**
 *
 * @param {number} n
 * @return {number}
 */
function addRandom(n) {
    return n + Math.random();
}

/**
 *
 * @param {number} length
 * @return {array}
 */
function getArray(length) {
    for (var i = 0, result = []; i < length; i++) result.push(void 0);
    return result;
}

/**
 *
 * @param {number} length
 * @return {array}
 */
function getRandomArray(length) {
    return getArray(length).map(function() {
        return Math.random();
    });
}

/**
 *
 * @param {function} fn
 * @param {number} times
 */
function repeat(fn, times) {
    while (times--) fn();
}

describe('benchmark', function() {
    var array;
    var fn;
    var overloadedFn;

    var ARRAY_LENGTH = 1;
    var REPEATS = 1000000;

    before(function() {
        array = getRandomArray(ARRAY_LENGTH);
    });

    describe('simple call', function() {
        before(function() {
            fn = Array.prototype.map.bind(array, function(element) {
                return addRandom(element);
            });

            var overloadedAddRandom = overload(addRandom);
            overloadedFn = Array.prototype.map.bind(array, function(element) {
                return overloadedAddRandom(element);
            });
        });

        it('fn', function() {
            repeat(fn, REPEATS);
        });

        it('overloadedFn', function() {
            repeat(overloadedFn, REPEATS);
        });
    });

    describe('overloaded call', function() {
        before(function() {
            array = array.map(function(element) {
                if (element < 0.5) return String(element);

                return element;
            });

            fn = Array.prototype.map.bind(array, function(element) {
                if (typeof element === 'string') {
                    return element + element;
                }

                return addRandom(element);
            });

            var overloadConcatOrAdd = overload(
                ['string'],
                function(s) {
                    return s + s;
                },

                ['number'],
                function(n) {
                    return addRandom(n);
                }
            );

            overloadedFn = Array.prototype.map.bind(array, function(element) {
                return overloadConcatOrAdd(element);
            });
        });

        it('fn', function() {
            repeat(fn, REPEATS);
        });

        it('overloadedFn', function() {
            repeat(overloadedFn, REPEATS);
        });
    });
});
