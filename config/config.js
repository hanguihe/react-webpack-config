const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { HotModuleReplacementPlugin, ProgressPlugin } = require('webpack');

const devServer = require('./devServer');

const env = process.env.NODE_ENV;
const isDevelopment = env === 'development';
const isProduction = env === 'production';

module.exports = {
  mode: env,
  // 构建失败后是否直接退出流程
  bail: isProduction,
  devtool: isDevelopment ? 'cheap-module-source-map' : false,
  entry: resolveFile('src/app.tsx'),
  output: {
    clean: true,
    path: resolveFile('dist'),
    pathinfo: isDevelopment,
    filename: isProduction ? 'jarvis.[contenthash:8].js' : 'jarvis.js',
    chunkFilename: isProduction ? 'jarvis.[contenthash:8]-chunk.js' : 'chunk.js',
    publicPath: isProduction ? './' : '/',
    globalObject: 'this',
  },
  optimization: {
    minimize: isProduction,
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'es2015',
        css: true,
      }),
    ],
    // sourceMap: isDevelopment,
    // splitChunks: {
    //   chunks: 'all',
    //   // name: isDevelopment,
    // },
    // runtimeChunk: {
    //   name: (entry) => `runtime-${entry.name}`,
    // },
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      '@': resolveFile('src'),
    },
  },
  performance: false,
  stats: isDevelopment
    ? 'none'
    : {
        all: false,
        assets: true,
        builtAt: true,
        errors: true,
        errorDetails: true,
        timings: true,
        version: true,
        warnings: true,
      },
  devServer,
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        oneOf: [
          {
            test: /\.(bmp|gif|jpe?g|png)$/,
            loader: require.resolve('url-loader'),
            options: {
              name: 'static/[name].[ext]',
              limit: 10240,
            },
          },
          {
            test: /\.(tsx|ts|jsx|js)$/,
            loader: require.resolve('babel-loader'),
            include: resolveFile('src'),
            options: {
              // customize: require.resolve("@babel/preset-react")
              babelrc: false,
              configFile: false,
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
                isDevelopment && require.resolve('react-refresh/babel'),
                require.resolve('@babel/plugin-transform-runtime'),
                [
                  require.resolve('babel-plugin-import'),
                  {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: true,
                  },
                ],
              ].filter(Boolean),
              sourceType: 'unambiguous',
            },
          },
          {
            test: /\.css$/,
            use: [
              isDevelopment && require.resolve('style-loader'),
              isProduction && {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  esModule: true,
                },
              },
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  sourceMap: isDevelopment,
                  modules: {
                    auto: true,
                  },
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  postcssOptions: {
                    sourceMap: isDevelopment,
                    plugins: [
                      require('postcss-flexbugs-fixes'),
                      [
                        require('postcss-preset-env'),
                        {
                          autoprefixer: {
                            flexbox: 'no-2009',
                          },
                          stage: 3,
                        },
                      ],
                      require('postcss-normalize')(),
                    ],
                  },
                },
              },
            ].filter(Boolean),
          },
          {
            test: /\.less$/,
            use: [
              isDevelopment && require.resolve('style-loader'),
              isProduction && {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  esModule: true,
                },
              },
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 3,
                  sourceMap: isDevelopment,
                  modules: {
                    auto: true,
                  },
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  postcssOptions: {
                    sourceMap: isDevelopment,
                    plugins: [
                      require('postcss-flexbugs-fixes'),
                      [
                        require('postcss-preset-env'),
                        {
                          autoprefixer: {
                            flexbox: 'no-2009',
                          },
                          stage: 3,
                        },
                      ],
                      require('postcss-normalize')(),
                    ],
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
            ].filter(Boolean),
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.(js|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/[name].[ext]',
            },
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
    isDevelopment && new HotModuleReplacementPlugin(),
    isDevelopment &&
      new ReactRefreshWebpackPlugin({
        overlay: false,
      }),
    isProduction &&
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
        chunkFilename: '[name].[contenthash:8]-chunk.css',
      }),
  ].filter(Boolean),
};

function resolveFile(filePath) {
  return path.resolve(__dirname, `../${filePath}`);
}
