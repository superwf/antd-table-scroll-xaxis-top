import * as path from 'path'

import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import config from '../webpack.config'
import { port, host } from '../config/testServer'

const server = new WebpackDevServer({ ...config.devServer!, port, host }, webpack({ ...config, mode: 'development' }))

const runServer = async () => {
  console.log('Starting server...')
  await server.start()
}

runServer()
