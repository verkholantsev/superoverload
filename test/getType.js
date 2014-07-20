'use strict';

var expect = require('must');
var getType = require('../lib/getType');

describe('getType(arg)', function () {
    describe('should return', function () {
        it('typeof arg, if typeof arg !== \'object\'', function () {
            [1, 'string', true, function () {}, void 0].forEach(function (element) {
                expect(getType(element)).to.be.eql(typeof element);
            });
        });

        it('\'array\' for array', function () {
            expect(getType([])).to.be.eql('array');
        });

        it('\'object\' for object', function () {
            expect(getType({})).to.be.eql('object');
        });

        it('\'null\' for null', function () {
            expect(getType(null)).to.be.eql('null');
        });

        it('\'regexp\' for regexp', function () {
            expect(getType(/a/)).to.be.eql('regexp');
        });

        it('\'date\' for date', function () {
            expect(getType(new Date())).to.be.eql('date');
        });

        it('\'function\' for function', function () {
            expect(getType(function () {})).to.be.eql('function');
        });
    });
});

