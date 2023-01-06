import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import type { Configuration } from 'webpack'
import { DefinePlugin, ProvidePlugin } from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { HtmlWebpackInjectExternalsPlugin } from 'html-webpack-inject-externals-plugin'

import { extensions, port, host, externals, unpkgHost } from './config/devServer'
import { resolveRoot } from './script/resolveRoot'

type NodeEnvType = 'production' | 'development' | 'test'

const NODE_ENV: NodeEnvType = (process.env.NODE_ENV as NodeEnvType) || 'development'
const isProd = NODE_ENV === 'production'
const { OPEN } = process.env

const publicPath = isProd ? '/demo' : '/'

const config: Configuration = {
  entry: {
    demo: [resolveRoot('src/demo.tsx')],
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
    open: Boolean(OPEN),
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
          plugins: isProd ? [] : ['react-refresh/babel'],
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
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
      template: './public/index.html',
      inject: true,
      filename: 'index.html',
      publicPath,
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
          path: `/umd/react.${isProd ? 'production.min' : 'development'}.js`,
        },
        {
          name: 'react-dom',
          path: `/umd/react-dom.${isProd ? 'production.min' : 'development'}.js`,
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
