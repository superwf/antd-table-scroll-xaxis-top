import path from 'path'

import type { Configuration } from 'webpack'
import { DefinePlugin, ProvidePlugin } from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin = require('html-webpack-plugin')
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { HtmlWebpackInjectExternalsPlugin } from 'html-webpack-inject-externals-plugin'

type NodeEnvType = 'production' | 'development'

const resolveRoot = (relativePath: string) => path.resolve(process.cwd(), relativePath)

const NODE_ENV: NodeEnvType = (process.env.NODE_ENV as NodeEnvType) || 'development'
const isProd = NODE_ENV === 'production'

export const extensions = ['.js', '.jsx', '.ts', '.tsx']

// eslint-disable-next-line import/no-mutable-exports
export default async () => {
  const config: Configuration = {
    entry: {
      antd3: [resolveRoot('src/antd3.tsx')],
      antd4: [resolveRoot('src/antd4.tsx')],
    },
    output: {
      publicPath: '/',
      filename: '[name].js',
      globalObject: 'window',
      path: resolveRoot('dist'),
    },
    devServer: {
      historyApiFallback: true,
      // inline: true,
      hot: true,
      // hotOnly: true,
      compress: true,
      // clientLogLevel: 'none',
      // injectClient: true,
      // quiet: false,
      // disableHostCheck: true,
      // contentBase: './public',
      open: true,
      https: false,
      host: '0.0.0.0',
    },
    resolve: {
      extensions,
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      antd3: 'antd',
      moment: 'moment',
      antd: 'antd',
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          include: [resolveRoot('src')],
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
            compact: isProd,
          },
        },
        // Process any JS outside of the app with Babel.
        // Unlike the application JS, we only compile the standard ES features.
        {
          test: /\.(js|mjs)$/,
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: false,
            compact: false,
            presets: [[require.resolve('babel-preset-react-app/dependencies'), { helpers: true }]],
            cacheDirectory: true,
            // See #6846 for context on why cacheCompression is disabled
            cacheCompression: false,

            // Babel sourcemaps are needed for debugging into node_modules
            // code.  Without the options below, debuggers like VSCode
            // show incorrect code and set breakpoints on the wrong lines.
            sourceMaps: !isProd,
            inputSourceMap: !isProd,
          },
        },
      ],
    },
    plugins: [],
    devtool: 'source-map',
  }

  config.plugins = [
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new DefinePlugin({
      'process.env': {
        NODE_ENV: `"${NODE_ENV}"`,
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: false,
      publicPath: '/',
    }),
    new HtmlWebpackInjectExternalsPlugin({
      host: 'https://unpkg.com',
      packages: [
        {
          name: 'react',
          path: `/umd/react.${isProd ? 'production.min' : 'development'}.js`,
        },
        {
          name: 'react-dom',
          path: `/umd/react-dom.${isProd ? 'production.min' : 'development'}.js`,
        },
        {
          name: 'antd3',
          fullPath: `https://unpkg.com/antd@3.26.20/dist/antd-with-locales${isProd ? '.min' : ''}.js`,
        },
        {
          name: 'antd',
          path: `/dist/antd-with-locales${isProd ? '.min' : ''}.js`,
        },
      ],
    }),
  ]

  if (isProd) {
    config.plugins.push(new CleanWebpackPlugin())
  } else {
    config.plugins.push(new ReactRefreshWebpackPlugin())
  }

  return config
}
