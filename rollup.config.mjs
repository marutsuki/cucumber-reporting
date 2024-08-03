import commonjs from '@rollup/plugin-commonjs';
import peerDeps from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy'

const config = [
    {
        input: ['build/src/index.js', 'build/cli.js'],
        output: {
            dir: 'dist',
            format: 'cjs',
        },
        plugins: [
            resolve(),
            commonjs(),
            terser(),
            peerDeps(),
            copy({
                targets: [
                    { src: 'build/src/index.d.ts', dest: 'dist' },
                    { src: 'templates', dest: 'dist' },
                    { src: 'package.json', dest: 'dist' },
                    { src: 'LICENSE', dest: 'dist' },
                    { src: 'README.md', dest: 'dist' },
                ]
            })
        ]
    },
    {
        input: ['build/scripts/index.js'],
        output: {
            file: 'dist/scripts/main.js',
            format: 'iife',
        },
        plugins: [
            resolve(),
            commonjs(),
            terser(),
            peerDeps(),
        ]
    },
];
export default config;