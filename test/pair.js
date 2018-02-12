'use strict';

import expect from 'must';
import pair from '../src/lib/pair';

describe('pair()', () => {
    it('should transform array into array of pairs', () => {
        expect(pair([0, 1, 2, 3])).to.be.eql([[0, 1], [2, 3]]);
    });
});

