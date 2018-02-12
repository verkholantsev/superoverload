'use strict';

const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const pkg = require('./package.json');

module.exports = {
    input: 'src/index.js',
    output: {
        name: 'superoverload',
        format: 'umd',
        file: pkg.main,
    },
    plugins: [
        babel({
            presets: [['env', { modules: false }], 'flow'],
            exclude: 'node_modules/**',
            babelrc: false,
        }),
        resolve(),
        commonjs(),
    ],
};
