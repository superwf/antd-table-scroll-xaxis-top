import type { RollupOptions } from 'rollup'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import replace from '@rollup/plugin-replace'

const extensions = ['.js', '.jsx', '.ts', '.tsx']

const { NODE_ENV } = process.env
const isProd = NODE_ENV === 'production'

const config: RollupOptions = {
  input: 'src/index.tsx',
  output: [
    {
      banner: '/* eslint-disable */',
      format: 'umd',
      preferConst: true,
      sourcemap: true,
      file: `dist/index.umd.${isProd ? 'min.' : ''}js`,
      name: 'AntdTableScrollXaxisTop',
      // exports: ['default'],
      globals: {
        react: 'React',
        lodash: '_',
      },
    },
  ],
  external: ['react', 'lodash'],
  plugins: [
    nodeResolve({
      extensions,
      preferBuiltins: true,
    }),
    replace({
      preventAssignment: false,
      values: {
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      },
    }),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      presets: ['react-app'],
      configFile: false,
      extensions,
    }),
    commonjs(),
  ],
}

if (isProd) {
  ;(config.output as any[])![0].plugins = [terser()]
}

export default config
