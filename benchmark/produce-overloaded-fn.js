import range from 'lodash/range';
import constant from 'lodash/constant';
import noop from 'lodash/noop';

import overload from '../';

export default function produceOverloadedFn(len, fn) {
  const args = range(len).reduce((acc, element, index) => {
    const signature = range(index + 1).map(constant('number'));
    return [...acc, signature, noop];
  }, []);

  return overload(fn, ...args);
}
