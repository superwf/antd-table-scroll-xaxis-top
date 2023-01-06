/* this file build umd mode only for production */
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import type { Configuration } from 'webpack'
import { DefinePlugin } from 'webpack'
// import { CleanWebpackPlugin } from 'clean-webpack-plugin'

import { extensions } from './config/devServer'
import { resolveRoot } from './script/resolveRoot'

type NodeEnvType = 'production' | 'development' | 'test'

const NODE_ENV: NodeEnvType = process.env.NODE_ENV as NodeEnvType

const isProd = NODE_ENV === 'production'

const styleLoader = isProd
  ? MiniCssExtractPlugin.loader
  : {
      loader: 'style-loader',
    }

// eslint-disable-next-line import/no-mutable-exports
const config: Configuration = {
  entry: {
    index: [resolveRoot('src/index.tsx')],
  },
  output: {
    path: resolveRoot('dist'),
    filename: `index.umd${isProd ? '.min' : ''}.js`,
    library: {
      type: 'umd2',
      name: 'AntdTableScrollXaxisTop',
      export: 'AntdTableScrollXaxisTop',
    },
    globalObject: 'window',
    publicPath: '/',
  },
  resolve: {
    extensions,
  },
  optimization: {
    minimize: isProd,
  },
  externals: {
    react: 'React',
    lodash: '_',
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
          compact: true,
        },
      },
      {
        test: /\.css$/,
        use: [
          styleLoader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
        include: [resolveRoot('src')],
      },
    ],
  },
  plugins: [
    new DefinePlugin({
      'process.env': {
        NODE_ENV: `"${NODE_ENV}"`,
      },
    }),
  ],
  devtool: 'source-map',
}
const { plugins } = config
if (plugins) {
  // plugins.push(new CleanWebpackPlugin())
  if (process.env.ANALYZE) {
    plugins.push(new BundleAnalyzerPlugin())
  }
}

export default config
