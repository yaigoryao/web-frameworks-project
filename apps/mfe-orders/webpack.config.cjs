const path = require('path');
const { createWebpackConfig } = require('@monorepo/webpack-config');
const pkg = require('./package.json');

module.exports = (env, argv) =>
  createWebpackConfig({
    mode: argv?.mode ?? (process.env.NODE_ENV === 'production' ? 'production' : 'development'),
    rootDir: __dirname,
    entry: path.resolve(__dirname, 'src/index.ts'),
    outputPath: path.resolve(__dirname, 'dist'),
    htmlTemplate: path.resolve(__dirname, 'public/index.html'),
    devServerPort: 3003,
    packageJson: pkg,
    federation: {
      name: 'mfeOrders',
      filename: 'remoteEntry.js',
      exposes: {
        './OrdersPage': './src/OrdersPage.tsx',
      },
    },
  });
