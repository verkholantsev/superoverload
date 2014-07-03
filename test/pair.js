'use strict';

var expect = require('must');
var pair = require('../lib/pair');

describe('pair', function () {
    it('должна разбивать массив на пары', function () {
        expect(pair([0, 1, 2, 3])).to.be.eql([[0, 1], [2, 3]]);
    });
});

