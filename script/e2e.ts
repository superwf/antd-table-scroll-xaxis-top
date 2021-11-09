import { spawn } from 'child_process'

import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'

import config from '../webpack.config.demo'
import { port, host } from '../config/testServer'

process.env.NODE_ENV = 'development'

const server = new WebpackDevServer(
  { ...config.devServer!, port, host, open: false },
  webpack({ ...config, mode: 'development' }),
)

const runServer = async () => {
  console.log('Starting test server for e2e ...')
  await server.start()
}

runServer().then(() => {
  const child = spawn('./node_modules/.bin/playwright', ['test', 'src/index.spec.ts', '--headed'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'test' },
  })

  child.addListener('exit', () => {
    server.stop()
  })
})
