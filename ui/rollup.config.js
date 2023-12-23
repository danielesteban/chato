import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import html from '@rollup/plugin-html';
import livereload from 'rollup-plugin-livereload';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import serve from 'rollup-plugin-serve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { compilerOptions: { paths: aliases } } = JSON.parse(fs.readFileSync(path.join(__dirname, 'tsconfig.json')));
const production = !process.env.ROLLUP_WATCH;
const outputPath = path.resolve(__dirname, '..', 'dist');

export default {
  input: path.join(__dirname, 'main.ts'),
  output: {
    dir: outputPath,
    entryFileNames: `[name].js`,
    format: 'iife',
    sourcemap: !production,
  },
  plugins: [
    alias({
      entries: [
        ...Object.keys(aliases).map((alias) => {
          const find = path.dirname(alias);
          return { find, replacement: path.join(__dirname, find) };
        }),
      ],
    }),
    copy({
      targets: [
        {
          src: 'ui/fonts/roboto-condensed-v27-latin-regular.woff2',
          rename: 'roboto-condensed.woff2',
          dest: 'dist',
        },
      ],
      copyOnce: true,
    }),
    commonjs(),
    nodeResolve({ browser: true, extensions: ['.js', '.ts'] }),
    svelte({ preprocess: sveltePreprocess({ sourceMap: !production }) }),
    typescript({ sourceMap: !production, inlineSources: !production }),
    postcss({ extract: true, minimize: production }),
    html({
      template: ({ files }) => (
        fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8')
          .replace(
            '__CSP__',
            production ? (
              "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
            ) : (
              "default-src 'self'; script-src 'self' http://localhost:35729/; style-src 'self' 'unsafe-inline'; connect-src ws://localhost:35729/;"
            ),
          )
          .replace(
            '<link rel="stylesheet">',
            (files.css || [])
              .map(({ fileName }) => `<link rel="stylesheet" href="${fileName}">`)
              .join('')
          )
          .replace(
            '<script></script>',
            (files.js || [])
              .map(({ fileName }) => `<script defer src="${fileName}"></script>`)
              .join('')
          )
          .replace(/(  |\n)/g, '')
      ),
    }),
    ...(production ? [
      terser({ format: { comments: false } }),
    ] : [
      serve({
        contentBase: outputPath,
        port: 8080,
      }),
      livereload({
        watch: outputPath,
      }),
    ]),
  ],
  watch: { clearScreen: false },
};
