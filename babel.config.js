/* eslint-disable @typescript-eslint/no-var-requires */
const config = {
  presets: ['react-app'],
  plugins: [],
}

if (process.env.NODE_ENV === 'development') {
  config.plugins.push('react-refresh/babel')
}

module.exports = config
