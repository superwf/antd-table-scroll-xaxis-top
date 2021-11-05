import path from 'path'

import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
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
      path: resolveRoot('demo'),
    },
    devServer: {
      historyApiFallback: true,
      hot: true,
      compress: true,
      port: 3000,
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
      antd3: 'antd3',
      lodash: '_',
      moment: 'moment',
      antd: 'antd',
    },
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
        publicPath: '/',
      }),
      new HtmlWebpackPlugin({
        template: './public/antd4.html',
        inject: true,
        filename: 'antd4.html',
        publicPath: '/',
      }),
      new HtmlWebpackInjectExternalsPlugin({
        host: 'https://unpkg.com',
        packages: [
          {
            name: 'lodash',
            path: `/lodash${isProd ? '.min' : ''}.js`,
          },
          {
            name: 'moment',
            path: `/min/moment-with-locales${isProd ? '.min' : ''}.js`,
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
            name: 'antd3',
            fullPath: `https://unpkg.com/antd@3.26.20/dist/antd-with-locales${isProd ? '.min' : ''}.js`,
            injectAfter: {
              tagName: 'script',
              voidTag: false,
              attributes: {},
              innerHTML: `
              window.antd3 = antd;
              if (window.location.pathname === '/antd3.html') {
                const l = document.createElement('link')
                l.setAttribute('rel', 'stylesheet')
                l.setAttribute('type', 'text/css')
                l.setAttribute('href', 'https://unpkg.com/antd@3.26.20/dist/antd.min.css')
                document.head.appendChild(l)
              }
            `,
            },
          },
          {
            name: 'antd',
            path: `/dist/antd-with-locales${isProd ? '.min' : ''}.js`,
            injectAfter: {
              tagName: 'script',
              voidTag: false,
              attributes: {},
              innerHTML: `
              const l = document.createElement('link')
              l.setAttribute('rel', 'stylesheet')
              l.setAttribute('type', 'text/css')
              l.setAttribute('href', 'https://unpkg.com/antd@4.16.13/dist/antd.min.css')
              document.head.appendChild(l)
            `,
            },
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
      plugins.push(new ReactRefreshWebpackPlugin())
    }
    if (process.env.ANALYZE) {
      plugins.push(new BundleAnalyzerPlugin())
    }
  }

  return config
}
