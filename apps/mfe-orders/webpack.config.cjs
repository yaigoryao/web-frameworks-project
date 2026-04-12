const { createRemoteConfig } = require('@monorepo/webpack-config');
const pkg = require('./package.json');

module.exports = () =>
  createRemoteConfig({
    dirname: __dirname,
    name: 'mfeOrders',
    port: 3003,
    exposes: {
      './OrdersPage': './src/OrdersPage.tsx',
    },
    packageJson: pkg,
  });
