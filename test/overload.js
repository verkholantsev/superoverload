'use strict';

var expect = require('must');
var overload = require('../lib/overload');

describe('overload()', function () {
    it('should return a function', function () {
        expect(overload()).to.be.a.function();
    });

    describe('called with even number of arguments', function () {
        describe('should return function, which', function () {
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

            it('calls function with corresponding signature', function () {
                expect(fn('string')).to.be.eql('string');
                expect(fn([])).to.be.eql('array');
            });

            describe('throw an exception', function () {
                it('if there is no function with corresponding signature', function () {
                    var message = 'No matching function for call with signature "number, number"';
                    expect(fn.bind(this, 1, 2)).to.throw(message);
                });
            });
        });
    });

    describe('called with odd number of arguments', function () {
        describe('should return function, which', function () {
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

            it('calls function with corresponding signature', function () {
                expect(fn('string')).to.be.eql('string');
                expect(fn(1)).to.be.eql('number');
            });

            describe('calls first function', function () {
                it('if there is no function with corresponding signature', function () {
                    expect(fn(true)).to.be.eql('default');
                });

                describe('with', function () {
                    beforeEach(function () {
                        fn = overload(
                            function (arg) {
                                return arg;
                            }
                        );
                    });

                    it('all passed arguments', function () {
                        expect(fn(true)).to.be.eql(true);
                    });
                });
            });

        });
    });

    describe('called with complicated signature', function () {
        var fn;
        beforeEach(function () {
            fn = overload(
                ['number', 'string', 'array', 'object', 'function', 'regexp', 'date'],
                function () {
                    return 'ok';
                }
            );
        });

        it('should return working overloaded function', function () {
            expect(fn(1, '', [], {}, function () {}, /1/, new Date())).to.be.eql('ok');
        });
    });
});

