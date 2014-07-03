'use strict';

var expect = require('must');
var overload = require('../lib/overload');

describe('overload', function () {
    it('должен возвращать функцию', function () {
        expect(overload()).to.be.a.function();
    });

    describe('при вызове с четным количеством аргументов', function () {
        describe('должен возвращать функцию, которая', function () {
            var fn;
            beforeEach(function () {
                fn = overload(
                    ['string'],
                    function () {
                        return 'string';
                    },

                    ['array'],
                    function () {
                        return 'array';
                    }
                );
            });

            it('вызывает подходящую по сигнатуре функцию', function () {
                expect(fn('string')).to.be.eql('string');
                expect(fn([])).to.be.eql('array');
            });

            describe('бросает исключение, если', function () {
                it('нет функции с подходящей сигнатурой', function () {
                    var message = 'No matching function for call with signature "number, number"';
                    expect(fn.bind(this, 1, 2)).to.throw(message);
                });
            });
        });
    });

    describe('при вызове с нечетным количеством аргументов', function () {
        describe('должен возвращать функцию, которая', function () {
            var fn;
            beforeEach(function () {
                fn = overload(
                    function () {
                        return 'default';
                    },

                    ['string'],
                    function () {
                        return 'string';
                    },

                    ['number'],
                    function () {
                        return 'number';
                    }
                );
            });

            it('вызывает подходящую по сигнатуре функцию', function () {
                expect(fn('string')).to.be.eql('string');
                expect(fn(1)).to.be.eql('number');
            });

            describe('вызывает первую функцию, если', function () {
                it('не нашел подходяшей по сигнатуре функции', function () {
                    expect(fn(true)).to.be.eql('default');
                });
            });

        });
    });
});

