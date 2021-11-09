import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import type { Configuration } from 'webpack'
import { DefinePlugin, ProvidePlugin } from 'webpack'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import HtmlWebpackPlugin = require('html-webpack-plugin')
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { HtmlWebpackInjectExternalsPlugin } from 'html-webpack-inject-externals-plugin'

import { port, host, externals } from './config/devServer'
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
    }),
    new HtmlWebpackPlugin({
      template: './public/antd4.html',
      inject: true,
      filename: 'antd4.html',
      publicPath,
    }),
    new HtmlWebpackInjectExternalsPlugin({
      host: '/demo',
      local: true,
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
        // {
        //   name: 'antd3',
        //   path: '/dist/antd.min.css',
        // },
        // {
        //   name: 'antd',
        //   path: '/dist/antd.min.css',
        // },
        {
          name: 'antd3',
          path: '/dist/antd-with-locales.min.js',
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
    plugins.push(
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: './public/static/**/*',
            // filter(filepath) {
            //   return !filepath.endsWith('.html')
            // },
            // to: ({ absoluteFilename }) => {
            //   console.log(absoluteFilename)
            //   return absoluteFilename.replace('/public', '')
            // },
          },
        ],
      }) as any,
    )
  } else {
    plugins.push(new ReactRefreshWebpackPlugin())
  }
  if (process.env.ANALYZE) {
    plugins.push(new BundleAnalyzerPlugin())
  }
}

export default config
