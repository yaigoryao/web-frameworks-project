const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { ModuleFederationPlugin } = webpack.container;

/** Лоадеры при npm workspaces часто только в корневом node_modules. */
function findAncestorNodeModules(startDir) {
  let dir = path.resolve(startDir);
  for (;;) {
    const candidate = path.join(dir, 'node_modules');
    if (fs.existsSync(candidate)) return candidate;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return path.join(startDir, 'node_modules');
}

function resolveInstalledVersion(appDir, packageName) {
  try {
    const resolved = require.resolve(`${packageName}/package.json`, { paths: [appDir] });
    return require(resolved).version;
  } catch {
    return false;
  }
}

/**
 * Полный набор shared для MUI + Emotion под Module Federation.
 * @param {Record<string, string>} deps
 * @param {string} appDir
 * @param {boolean} eager
 */
function muiShared(deps, appDir, eager) {
  const req = (pkg) => deps[pkg] || resolveInstalledVersion(appDir, pkg) || false;

  const base = (pkg, ver) => ({
    singleton: true,
    strictVersion: false,
    requiredVersion: ver !== undefined ? ver : req(pkg),
    eager,
  });

  const reactVer = deps.react || false;

  return {
    react: base('react'),
    'react-dom': base('react-dom'),
    'react/jsx-runtime': { singleton: true, strictVersion: false, requiredVersion: reactVer, eager },
    'react/jsx-dev-runtime': { singleton: true, strictVersion: false, requiredVersion: reactVer, eager },
    'react-router-dom': base('react-router-dom'),
    '@mui/material': base('@mui/material'),
    '@mui/icons-material': base('@mui/icons-material'),
    '@mui/system': base('@mui/system'),
    '@mui/utils': base('@mui/utils'),
    '@mui/styled-engine': base('@mui/styled-engine'),
    '@mui/private-theming': base('@mui/private-theming'),
    '@emotion/react': base('@emotion/react'),
    '@emotion/styled': base('@emotion/styled'),
    '@emotion/cache': base('@emotion/cache'),
    'react-is': base('react-is'),
  };
}

function muiSharedForHost(deps, appDir) {
  return muiShared(deps, appDir, true);
}

/**
 * Унифицированная сборка (host / remote) по образцу createWebpackConfig({ mode, entry, federation, devServerProxy, ... }).
 *
 * @param {object} options
 * @param {string} options.mode - 'development' | 'production'
 * @param {string} options.rootDir - __dirname приложения
 * @param {string} options.entry - абсолютный путь к entry
 * @param {string} options.outputPath - абсолютный путь к dist
 * @param {string} options.htmlTemplate - абсолютный путь к index.html
 * @param {number} options.devServerPort
 * @param {import('webpack-dev-server').Configuration['proxy']} [options.devServerProxy]
 * @param {import('webpack').Configuration['devServer']} [options.devServer] - доп. поля devServer (мержатся поверх)
 * @param {object} options.packageJson
 * @param {object} options.federation
 * @param {string} options.federation.name
 * @param {string} [options.federation.filename] - для remote, по умолчанию remoteEntry.js если есть exposes
 * @param {Record<string, string>} [options.federation.exposes]
 * @param {Record<string, string>} [options.federation.remotes]
 * @param {Record<string, string>} [options.defineEnv]
 * @param {import('webpack').WebpackPluginInstance[]} [options.extraPlugins]
 */
function createWebpackConfig(options) {
  const {
    mode,
    rootDir,
    entry,
    outputPath,
    htmlTemplate,
    devServerPort,
    devServerProxy,
    devServer: devServerExtra = {},
    packageJson,
    federation,
    defineEnv = {},
    extraPlugins = [],
  } = options;

  const isProd = mode === 'production';
  const deps = packageJson.dependencies || {};
  const nodeModulesRoot = findAncestorNodeModules(rootDir);
  const repoNodeModules = path.resolve(__dirname, '../../node_modules');
  let tsLoaderPath = 'ts-loader';
  try {
    tsLoaderPath = require.resolve('ts-loader', {
      paths: [repoNodeModules, nodeModulesRoot],
    });
  } catch {
    /* fallback: строка ts-loader */
  }
  const publicPath =
    process.env.WEB_PUBLIC_PATH || (isProd ? 'auto' : `http://localhost:${devServerPort}/`);

  const hasRemotes = federation.remotes && Object.keys(federation.remotes).length > 0;
  const hasExposes = federation.exposes && Object.keys(federation.exposes).length > 0;
  const shared = hasRemotes ? muiSharedForHost(deps, rootDir) : muiShared(deps, rootDir, false);

  const mfOptions = {
    name: federation.name,
    shared,
  };
  if (hasRemotes) mfOptions.remotes = federation.remotes;
  if (hasExposes) {
    mfOptions.exposes = federation.exposes;
    mfOptions.filename = federation.filename || 'remoteEntry.js';
    mfOptions.library =
      federation.library || { type: 'var', name: federation.name };
  }

  const define = {
    'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
    'process.env.AUTH_API_BASE_URL': JSON.stringify(
      defineEnv.AUTH_API_BASE_URL || process.env.AUTH_API_BASE_URL || 'http://localhost:3001'
    ),
    'process.env.DATA_API_BASE_URL': JSON.stringify(
      defineEnv.DATA_API_BASE_URL || process.env.DATA_API_BASE_URL || 'http://localhost:3002'
    ),
  };

  const plugins = [
    new webpack.DefinePlugin(define),
    new ModuleFederationPlugin(mfOptions),
    new HtmlWebpackPlugin({ template: htmlTemplate }),
    ...extraPlugins,
  ];

  return {
    mode: isProd ? 'production' : 'development',
    context: rootDir,
    entry,
    output: {
      path: outputPath,
      filename: '[name].[contenthash].js',
      publicPath,
      clean: true,
      /** Иначе webpack берёт `name` из package.json (`mfe-orders`) — дефис ломает MF library в production. */
      uniqueName: federation.name,
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
    },
    resolveLoader: {
      modules: [repoNodeModules, nodeModulesRoot, 'node_modules'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: tsLoaderPath,
          exclude: /node_modules/,
          options: { transpileOnly: true },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins,
    devServer: {
      port: devServerPort,
      hot: true,
      historyApiFallback: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
      static: [path.join(rootDir, 'public')],
      ...(devServerProxy && devServerProxy.length ? { proxy: devServerProxy } : {}),
      ...devServerExtra,
    },
    devtool: isProd ? 'source-map' : 'eval-source-map',
  };
}

/** @deprecated используйте createWebpackConfig */
function createHostConfig(options) {
  const { dirname, port, remotes, devServer: devServerExtra, defineEnv = {}, packageJson } = options;
  const isProd = process.env.NODE_ENV === 'production';
  return createWebpackConfig({
    mode: isProd ? 'production' : 'development',
    rootDir: dirname,
    entry: path.join(dirname, 'src/index.tsx'),
    outputPath: path.join(dirname, 'dist'),
    htmlTemplate: path.join(dirname, 'public/index.html'),
    devServerPort: port,
    packageJson,
    federation: { name: 'host', remotes },
    defineEnv,
    devServer: devServerExtra || {},
  });
}

/** @deprecated используйте createWebpackConfig */
function createRemoteConfig(options) {
  const { dirname, name, port, exposes, packageJson } = options;
  const isProd = process.env.NODE_ENV === 'production';
  return createWebpackConfig({
    mode: isProd ? 'production' : 'development',
    rootDir: dirname,
    entry: path.join(dirname, 'src/index.ts'),
    outputPath: path.join(dirname, 'dist'),
    htmlTemplate: path.join(dirname, 'public/index.html'),
    devServerPort: port,
    packageJson,
    federation: { name, filename: 'remoteEntry.js', exposes },
  });
}

module.exports = {
  createWebpackConfig,
  createHostConfig,
  createRemoteConfig,
  muiShared,
  muiSharedForHost,
};
