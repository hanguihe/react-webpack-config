const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { HotModuleReplacementPlugin, ProgressPlugin } = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

function resolveFile(filePath) {
  return path.resolve(__dirname, `../${filePath}`);
}

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: resolveFile('src/app.tsx'),
  output: {
    path: resolveFile('dist'),
    pathinfo: true,
    filename: 'jarvis.js',
    chunkFilename: 'chunk.js',
    publicPath: '/',
  },
  cache: {
    type: 'filesystem',
    cacheDirectory: resolveFile('node_modules/.cache'),
  },
  infrastructureLogging: {
    level: 'none',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      '@': resolveFile('src'),
    },
  },
  performance: false,
  devServer: {
    compress: true,
    clientLogLevel: 'none',
    contentBase: path.join(__dirname, '../dist'),
    watchContentBase: true,
    hot: true,
    hotOnly: false,
    open: false,
    overlay: false,
    port: 3000,
  },
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        oneOf: [
          {
            test: /\.svg$/,
            type: 'asset/inline',
          },
          {
            test: /\.(bmp|gif|jpe?g|png)$/,
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 10240,
              },
            },
          },
          {
            test: /\.(tsx|ts|jsx|js)$/,
            loader: require.resolve('babel-loader'),
            include: resolveFile('src'),
            options: {
              babelrc: false,
              configFile: false,
              cacheDirectory: true,
              cacheCompression: false,
              compact: false,
              sourceType: 'unambiguous',
              presets: [
                [
                  require.resolve('@babel/preset-env'),
                  {
                    modules: false,
                  },
                ],
                [
                  require.resolve('@babel/preset-react'),
                  {
                    runtime: 'automatic',
                  },
                ],
                require.resolve('@babel/preset-typescript'),
              ],
              plugins: [
                require.resolve('react-refresh/babel'),
                require.resolve('@babel/plugin-transform-runtime'),
                [
                  require.resolve('babel-plugin-import'),
                  {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: true,
                  },
                ],
              ],
            },
          },
          {
            test: /\.css$/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  sourceMap: true,
                  modules: {
                    auto: true,
                  },
                },
              },
            ],
          },
          {
            test: /\.less$/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  sourceMap: true,
                  modules: {
                    auto: true,
                  },
                },
              },
              {
                loader: require.resolve('less-loader'),
                options: {
                  lessOptions: {
                    modifyVars: {},
                    javascriptEnabled: true,
                  },
                },
              },
            ],
          },
          {
            exclude: [/\.(js|jsx|ts|tsx|html|json)$/],
            type: 'asset/resource',
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: resolveFile('public/index.html'),
    }),
    new ProgressPlugin(),
    new HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin({
      overlay: false,
    }),
  ],
};
