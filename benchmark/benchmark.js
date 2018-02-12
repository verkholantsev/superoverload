'use strict';

import overload from '../';

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
    const result = [];
    for (let i = 0; i < length; i++) result.push(void 0);
    return result;
}

/**
 *
 * @param {number} length
 * @return {array}
 */
function getRandomArray(length) {
    return getArray(length).map(() => Math.random());
}

/**
 *
 * @param {function} fn
 * @param {number} times
 */
function repeat(fn, times) {
    while (times--) fn();
}

describe('benchmark', () => {
    let array;
    let fn;
    let overloadedFn;

    let ARRAY_LENGTH = 1;
    let REPEATS = 1000000;

    before(() => {
        array = getRandomArray(ARRAY_LENGTH);
    });

    describe('simple call', () => {
        before(() => {
            fn = Array.prototype.map.bind(array, element => addRandom(element));

            const overloadedAddRandom = overload(addRandom);
            overloadedFn = Array.prototype.map.bind(array, element => overloadedAddRandom(element));
        });

        it('fn', () => {
            repeat(fn, REPEATS);
        });

        it('overloadedFn', () => {
            repeat(overloadedFn, REPEATS);
        });
    });

    describe('overloaded call', () => {
        before(() => {
            array = array.map(element => {
                if (element < 0.5) return String(element);

                return element;
            });

            fn = Array.prototype.map.bind(array, element => {
                if (typeof element === 'string') {
                    return element + element;
                }

                return addRandom(element);
            });

            const overloadConcatOrAdd = overload(
                ['string'],
                s => s + s,

                ['number'],
                n => addRandom(n)
            );

            overloadedFn = Array.prototype.map.bind(array, element => overloadConcatOrAdd(element));
        });

        it('fn', () => {
            repeat(fn, REPEATS);
        });

        it('overloadedFn', () => {
            repeat(overloadedFn, REPEATS);
        });
    });
});
