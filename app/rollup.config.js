import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import copy from 'rollup-plugin-copy';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { dependencies } = JSON.parse(fs.readFileSync(path.join(__dirname, 'app.json')));
const outputPath = path.resolve(__dirname, '..', 'dist');

export default ['app.ts', 'api.ts'].map((file) => ({
  input: path.join(__dirname, file),
  external: ['electron', ...Object.keys(dependencies)],
  output: {
    dir: outputPath,
    entryFileNames: `[name].js`,
    format: file === 'app.ts' ? 'es' : 'cjs',
    sourcemap: false,
  },
  plugins: [
    ...(file === 'app.ts' ? [
      copy({
        targets: [
          { src: 'app/app.json', rename: 'package.json', dest: 'dist' },
          { src: 'app/models.json', dest: 'dist' },
        ],
        copyOnce: true,
      }),
      replace({
        preventAssignment: false,
        __DEV__: JSON.stringify(!!process.env.DEV),
      }),
    ] : []),
    nodeResolve({ extensions: ['.js', '.ts'] }),
    typescript({ sourceMap: false }),
    terser({ format: { comments: false } }),
  ],
}));
