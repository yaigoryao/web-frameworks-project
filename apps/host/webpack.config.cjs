const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { createWebpackConfig } = require('@monorepo/webpack-config');
const pkg = require('./package.json');

module.exports = (env, argv) => {
  const mode = argv?.mode ?? (process.env.NODE_ENV === 'production' ? 'production' : 'development');
  const isProd = mode === 'production';
  const mfeOrdersOrigin =
    process.env.MFE_ORDERS_ORIGIN || (isProd ? '/mfe-orders' : 'http://localhost:3003');
  const mfeCarsOrigin =
    process.env.MFE_CARS_ORIGIN || (isProd ? '/mfe-cars' : 'http://localhost:3004');

  return createWebpackConfig({
    mode,
    rootDir: __dirname,
    entry: path.resolve(__dirname, 'src/index.tsx'),
    outputPath: path.resolve(__dirname, 'dist'),
    htmlTemplate: path.resolve(__dirname, 'public/index.html'),
    devServerPort: Number(process.env.HOST_PORT) || 3000,
    devServerProxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3002',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    ],
    packageJson: pkg,
    federation: {
      name: 'host',
      remotes: {
        mfeOrders: `mfeOrders@${mfeOrdersOrigin}/remoteEntry.js`,
        mfeCars: `mfeCars@${mfeCarsOrigin}/remoteEntry.js`,
      },
    },
    extraPlugins: [
      new CopyWebpackPlugin({
        patterns: [{ from: path.resolve(__dirname, 'public/cars'), to: 'cars' }],
      }),
    ],
  });
};
