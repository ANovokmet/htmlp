import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

// rollup.config.js
export default {
    input: 'index.js',
    output: {
        file: 'docs/bundle.js',
        format: 'iife',
        name: 'htmlp'
    },
    plugins: [json(), resolve({
        jsnext: true,
        main: true
      }), commonjs()]
};