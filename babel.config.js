/* eslint-disable @typescript-eslint/no-var-requires */
const config = {
  presets: ['react-app'],
  plugins: [],
  // plugins: [
  //   [
  //     {
  //       extensions: ['.js', '.jsx', '.ts', '.tsx', '.es', '.es6', '.mjs'],
  //     },
  //   ],
  // ],
}

const isEnvDev = process.env.NODE_ENV !== 'production'
if (isEnvDev) {
  config.plugins.push('react-refresh/babel')
}

module.exports = config
