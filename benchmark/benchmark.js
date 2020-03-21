import Benchmark from 'benchmark';
import range from 'lodash/range';
import constant from 'lodash/constant';

import produceOverloadedFn from './produce-overloaded-fn';
import log from './log';

const getRandomArray = len => range(len).map(() => Math.random());

const array = getRandomArray(100);

const addRandom = n => n + Math.random();

const fn = () => {
  for (const element of array) {
    addRandom(element);
  }
};

const overloaded0 = produceOverloadedFn(0, fn);

const overloaded100 = produceOverloadedFn(100, fn);
const overloaded100Args = range(100).map(constant(1));

const overloaded1000 = produceOverloadedFn(1000, fn);
const overloaded1000Args = range(1000).map(constant(1));

const suite = new Benchmark.Suite();

suite
  .add('Not overloaded'.padEnd(40, '.'), () => {
    fn();
  })
  .add('Overloaded with 1000x options'.padEnd(40, '.'), () => {
    overloaded1000.apply(null, overloaded1000Args);
  })
  .add('Overloaded with 100x options'.padEnd(40, '.'), () => {
    overloaded100.apply(null, overloaded100Args);
  })
  .add('Overloaded with 0x option'.padEnd(40, '.'), () => {
    overloaded0();
  })
  .on('cycle', event => log(String(event.target)))
  .run({async: true});
