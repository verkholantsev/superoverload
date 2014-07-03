'use strict';

var expect = require('must');
var getType = require('../lib/getType');

describe('getType(arg)', function () {
    describe('должна возвращать', function () {
        it('typeof arg, если typeof arg !== \'object\'', function () {
            [1, 'string', true, function () {}, void 0].forEach(function (element) {
                expect(getType(element)).to.be.eql(typeof element);
            });
        });

        it('\'array\' для массива', function () {
            expect(getType([])).to.be.eql('array');
        });

        it('\'object\' для объекта', function () {
            expect(getType({})).to.be.eql('object');
        });

        it('\'null\' для null', function () {
            expect(getType(null)).to.be.eql('null');
        });

        it('\'regexp\' для регулярного выражения', function () {
            expect(getType(/a/)).to.be.eql('regexp');
        });

        it('\'date\' для регулярного выражения', function () {
            expect(getType(new Date())).to.be.eql('date');
        });
    });
});

