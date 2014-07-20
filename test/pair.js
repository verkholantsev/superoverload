'use strict';

var expect = require('must');
var pair = require('../lib/pair');

describe('pair()', function () {
    it('should transform array into array of pairs', function () {
        expect(pair([0, 1, 2, 3])).to.be.eql([[0, 1], [2, 3]]);
    });
});

