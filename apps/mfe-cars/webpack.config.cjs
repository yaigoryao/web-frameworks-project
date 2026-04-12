const { createRemoteConfig } = require('@monorepo/webpack-config');
const pkg = require('./package.json');

module.exports = () =>
  createRemoteConfig({
    dirname: __dirname,
    name: 'mfeCars',
    port: 3004,
    exposes: {
      './CarsPage': './src/CarsPage.tsx',
    },
    packageJson: pkg,
  });
