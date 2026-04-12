const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { ModuleFederationPlugin } = webpack.container;

/**
 * @param {Record<string, string>} deps
 */
function muiShared(deps) {
  return {
    react: { singleton: true, requiredVersion: deps.react, eager: false },
    'react-dom': { singleton: true, requiredVersion: deps['react-dom'], eager: false },
    'react-router-dom': { singleton: true, requiredVersion: deps['react-router-dom'], eager: false },
    '@mui/material': { singleton: true, requiredVersion: deps['@mui/material'], eager: false },
    '@mui/icons-material': { singleton: true, requiredVersion: deps['@mui/icons-material'], eager: false },
    '@emotion/react': { singleton: true, requiredVersion: deps['@emotion/react'], eager: false },
    '@emotion/styled': { singleton: true, requiredVersion: deps['@emotion/styled'], eager: false },
  };
}

/**
 * @typedef {Object} HostOptions
 * @property {string} dirname - __dirname приложения
 * @property {number} port
 * @property {Record<string, string>} remotes - ключ → URL remoteEntry (полный URL в dev)
 * @property {import('webpack').Configuration['devServer']} [devServer]
 * @property {Record<string, string>} [defineEnv] - ключи process.env.X
 * @property {object} packageJson - dependencies для shared
 */

/**
 * @param {HostOptions} options
 * @returns {import('webpack').Configuration}
 */
function createHostConfig(options) {
  const { dirname, port, remotes, devServer: devServerExtra, defineEnv = {}, packageJson } = options;
  const isProd = process.env.NODE_ENV === 'production';
  const deps = packageJson.dependencies || {};
  const publicPath =
    process.env.WEB_PUBLIC_PATH || (isProd ? 'auto' : `http://localhost:${port}/`);

  const define = {
    'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
    'process.env.AUTH_API_BASE_URL': JSON.stringify(
      defineEnv.AUTH_API_BASE_URL || process.env.AUTH_API_BASE_URL || 'http://localhost:3001'
    ),
    'process.env.DATA_API_BASE_URL': JSON.stringify(
      defineEnv.DATA_API_BASE_URL || process.env.DATA_API_BASE_URL || 'http://localhost:3002'
    ),
  };

  return {
    mode: isProd ? 'production' : 'development',
    context: dirname,
    entry: path.join(dirname, 'src/index.tsx'),
    output: {
      path: path.join(dirname, 'dist'),
      filename: '[name].[contenthash].js',
      publicPath,
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: { transpileOnly: true },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin(define),
      new ModuleFederationPlugin({
        name: 'host',
        remotes,
        shared: muiShared(deps),
      }),
      new HtmlWebpackPlugin({
        template: path.join(dirname, 'public/index.html'),
      }),
    ],
    devServer: {
      port,
      hot: true,
      historyApiFallback: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
      static: [path.join(dirname, 'public')],
      ...devServerExtra,
    },
    devtool: isProd ? 'source-map' : 'eval-source-map',
  };
}

/**
 * @typedef {Object} RemoteOptions
 * @property {string} dirname
 * @property {string} name - уникальное имя MF (например mfeOrders)
 * @property {number} port
 * @property {Record<string, string>} exposes - путь относительно dirname/src обычно
 * @property {object} packageJson
 */

/**
 * @param {RemoteOptions} options
 * @returns {import('webpack').Configuration}
 */
function createRemoteConfig(options) {
  const { dirname, name, port, exposes, packageJson } = options;
  const isProd = process.env.NODE_ENV === 'production';
  const deps = packageJson.dependencies || {};
  const publicPath =
    process.env.WEB_PUBLIC_PATH || (isProd ? 'auto' : `http://localhost:${port}/`);

  const define = {
    'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
    'process.env.AUTH_API_BASE_URL': JSON.stringify(
      process.env.AUTH_API_BASE_URL || 'http://localhost:3001'
    ),
    'process.env.DATA_API_BASE_URL': JSON.stringify(
      process.env.DATA_API_BASE_URL || 'http://localhost:3002'
    ),
  };

  return {
    mode: isProd ? 'production' : 'development',
    context: dirname,
    entry: path.join(dirname, 'src/index.ts'),
    output: {
      path: path.join(dirname, 'dist'),
      filename: '[name].[contenthash].js',
      publicPath,
      clean: true,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: { transpileOnly: true },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin(define),
      new ModuleFederationPlugin({
        name,
        filename: 'remoteEntry.js',
        exposes,
        shared: muiShared(deps),
      }),
      new HtmlWebpackPlugin({
        template: path.join(dirname, 'public/index.html'),
      }),
    ],
    devServer: {
      port,
      hot: true,
      historyApiFallback: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
      static: [path.join(dirname, 'public')],
    },
    devtool: isProd ? 'source-map' : 'eval-source-map',
  };
}

module.exports = { createHostConfig, createRemoteConfig, muiShared };
