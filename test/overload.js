'use strict';

import expect from 'must';
import overload from '../src/overload';

describe('overload()', () => {
    it('should return a function', () => {
        expect(overload()).to.be.a.function();
    });

    describe('called with even number of arguments', () => {
        describe('should return function, which', () => {
            let fn;
            beforeEach(() => {
                fn = overload(
                    ['string'],
                    () => 'string',

                    ['array'],
                    () => 'array'
                );
            });

            it('calls function with corresponding signature', () => {
                expect(fn('string')).to.be.eql('string');
                expect(fn([])).to.be.eql('array');
            });

            describe('throw an exception', () => {
                it('if there is no function with corresponding signature', () => {
                    const message = 'No matching function for call with signature "number, number"';
                    expect(() => fn(1, 2)).to.throw(message);
                });
            });
        });
    });

    describe('called with odd number of arguments', () => {
        describe('should return function, which', () => {
            let fn;
            beforeEach(() => {
                fn = overload(
                    () => 'default',

                    ['string'],
                    () => 'string',

                    ['number'],
                    () => 'number'
                );
            });

            it('calls function with corresponding signature', () => {
                expect(fn('string')).to.be.eql('string');
                expect(fn(1)).to.be.eql('number');
            });

            describe('calls first function', () => {
                it('if there is no function with corresponding signature', () => {
                    expect(fn(true)).to.be.eql('default');
                });

                describe('with', () => {
                    beforeEach(() => {
                        fn = overload(arg => arg);
                    });

                    it('all passed arguments', () => {
                        expect(fn(true)).to.be.eql(true);
                    });
                });
            });
        });
    });

    describe('called with complicated signature', () => {
        var fn;
        beforeEach(() => {
            fn = overload(['number', 'string', 'array', 'object', 'function', 'regexp', 'date'], () => 'ok');
        });

        it('should return working overloaded function', () => {
            expect(fn(1, '', [], {}, () => {}, /1/, new Date())).to.be.eql('ok');
        });
    });
});
