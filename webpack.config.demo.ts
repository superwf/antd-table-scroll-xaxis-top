import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import type { Configuration } from 'webpack'
import { DefinePlugin, ProvidePlugin } from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin = require('html-webpack-plugin')
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { HtmlWebpackInjectExternalsPlugin } from 'html-webpack-inject-externals-plugin'
import antd3Pkg from 'antd3/package.json'
import antdPkg from 'antd/package.json'

import { port, host, externals, unpkgHost } from './config/devServer'
import { resolveRoot } from './script/resolveRoot'

type NodeEnvType = 'production' | 'development' | 'test'

const NODE_ENV: NodeEnvType = (process.env.NODE_ENV as NodeEnvType) || 'development'
const isProd = NODE_ENV === 'production'

export const extensions = ['.js', '.jsx', '.ts', '.tsx']

const publicPath = isProd ? '/demo' : '/'

const config: Configuration = {
  entry: {
    antd3: [resolveRoot('src/antd3.tsx')],
    antd4: [resolveRoot('src/antd4.tsx')],
  },
  output: {
    publicPath,
    filename: '[name].js',
    globalObject: 'window',
    path: isProd ? resolveRoot('demo') : resolveRoot('public'),
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    compress: true,
    port,
    open: true,
    https: false,
    host,
  },
  resolve: {
    extensions,
  },
  externals,
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: [resolveRoot('src')],
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          cacheCompression: false,
          compact: isProd,
        },
      },
    ],
  },
  plugins: [
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new DefinePlugin({
      'process.env': {
        NODE_ENV: `"${NODE_ENV}"`,
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/antd3.html',
      inject: true,
      filename: 'antd3.html',
      publicPath,
      css: `<link rel="stylesheet" href="${isProd ? unpkgHost : '/static'}/antd${
        isProd ? `@${antd3Pkg.version}` : '3'
      }/dist/antd.min.css">`,
    }),
    new HtmlWebpackPlugin({
      template: './public/antd4.html',
      inject: true,
      filename: 'antd4.html',
      publicPath,
      css: `<link rel="stylesheet" href="${isProd ? unpkgHost : '/static'}/antd${
        isProd ? `@${antdPkg.version}` : ''
      }/dist/antd.min.css">`,
    }),
    new HtmlWebpackInjectExternalsPlugin({
      host: unpkgHost,
      local: !isProd,
      localPrefix: isProd ? '/demo/static' : '/static',
      packages: [
        {
          name: 'lodash',
          path: '/lodash.min.js',
        },
        {
          name: 'moment',
          path: '/min/moment-with-locales.min.js',
        },
        {
          name: 'react',
          path: '/umd/react.production.min.js',
        },
        {
          name: 'react-dom',
          path: '/umd/react-dom.production.min.js',
        },
        {
          name: 'antd3',
          fullPath: isProd ? `${unpkgHost}/antd@${antd3Pkg.version}/dist/antd-with-locales.min.js` : undefined,
          path: isProd ? undefined : '/dist/antd-with-locales.min.js',
          injectAfter: {
            tagName: 'script',
            voidTag: false,
            attributes: {},
            innerHTML: `
              window.antd3 = antd;
            `,
          },
        },
        {
          name: 'antd',
          path: '/dist/antd-with-locales.min.js',
        },
      ],
    }),
  ],
  devtool: 'source-map',
}
const { plugins } = config
if (plugins) {
  if (isProd) {
    plugins.push(new CleanWebpackPlugin())
  } else {
    plugins.push(
      new ReactRefreshWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: resolveRoot('node_modules/antd3/dist/antd.min.css'),
            to: resolveRoot('public/static/antd3/dist'),
          },
          {
            from: resolveRoot('node_modules/antd/dist/antd.min.css'),
            to: resolveRoot('public/static/antd/dist'),
          },
        ],
      }) as any,
    )
  }
  if (process.env.ANALYZE) {
    plugins.push(new BundleAnalyzerPlugin())
  }
}

export default config
