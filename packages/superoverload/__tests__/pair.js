'use strict';

import pair from '../src/pair';

describe('pair()', () => {
  it('should transform array into array of pairs', () => {
    expect(pair([0, 1, 2, 3])).toEqual([
      [0, 1],
      [2, 3],
    ]);
  });
});
