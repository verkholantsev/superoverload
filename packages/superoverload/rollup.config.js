'use strict';

const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const {terser} = require('rollup-plugin-terser');
const pkg = require('./package.json');

module.exports = {
  input: 'src/index.js',
  output: [
    {
      name: 'superoverload',
      format: 'umd',
      file: pkg.main,
    },
    {
      name: 'superoverload',
      format: 'umd',
      file: pkg.main.replace(/\.js$/, '.min.js'),
      plugins: [terser()],
    },
  ],
  plugins: [
    babel({
      presets: [['@babel/env', {modules: false}], '@babel/flow'],
      plugins: ['babel-plugin-compress-template-literals'],
      exclude: 'node_modules/**',
      babelrc: false,
    }),
    resolve(),
    commonjs(),
  ],
};
