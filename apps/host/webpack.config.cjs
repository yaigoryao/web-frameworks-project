const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { createHostConfig } = require('@monorepo/webpack-config');
const pkg = require('./package.json');

const isProd = process.env.NODE_ENV === 'production';
const mfeOrdersOrigin =
  process.env.MFE_ORDERS_ORIGIN || (isProd ? '/mfe-orders' : 'http://localhost:3003');
const mfeCarsOrigin =
  process.env.MFE_CARS_ORIGIN || (isProd ? '/mfe-cars' : 'http://localhost:3004');

module.exports = () => {
  const config = createHostConfig({
    dirname: __dirname,
    port: Number(process.env.HOST_PORT) || 3000,
    remotes: {
      mfeOrders: `mfeOrders@${mfeOrdersOrigin}/remoteEntry.js`,
      mfeCars: `mfeCars@${mfeCarsOrigin}/remoteEntry.js`,
    },
    packageJson: pkg,
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:3002',
          changeOrigin: true,
          pathRewrite: { '^/api': '' },
        },
      },
    },
  });

  config.plugins.push(
    new CopyWebpackPlugin({
      patterns: [{ from: path.join(__dirname, 'public/cars'), to: 'cars' }],
    })
  );

  return config;
};
