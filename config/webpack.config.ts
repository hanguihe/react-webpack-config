import path from 'path';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { ESBuildMinifyPlugin } from 'esbuild-loader';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import { HotModuleReplacementPlugin, ProgressPlugin } from 'webpack';

export default (env: string) => {
  const isDevelopment = env === 'development';
  const isProduction = env === 'production';

  return {
    mode: env,
    // 构建失败后是否直接退出流程
    bail: isProduction,
    devtool: isDevelopment ? 'cheap-module-source-map' : false,
    entry: resolveFile('src/app.tsx'),
    output: {
      path: resolveFile('dist'),
      pathinfo: isDevelopment,
      filename: isProduction ? 'jarvis.[contenthash:8].js' : 'jarvis.js',
      chunkFilename: isProduction ? 'jarvis.[contenthash:8]-chunk.js' : 'chunk.js',
      publicPath: isProduction ? './' : '/',
    },
    cache: {
      type: 'filesystem',
      cacheDirectory: resolveFile('node_modules/.cache'),
    },
    infrastructureLogging: {
      level: 'none',
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new ESBuildMinifyPlugin({
          target: 'es2015',
          css: true,
        }),
      ],
    },
    resolve: {
      modules: ['node_modules'],
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      alias: {
        '@': resolveFile('src'),
      },
    },
    performance: false,
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
                compact: isProduction,
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
                    sourceMap: isDevelopment,
                    modules: {
                      auto: true,
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
                    importLoaders: 1,
                    sourceMap: isDevelopment,
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
              ].filter(Boolean),
            },
            {
              exclude: [/\.(js|jsx|ts|tsx|html|json)$/],
              type: 'asset/resource',
              // options: {
              //   name: 'static/[name].[ext]',
              // },
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
};

function resolveFile(filePath: string) {
  return path.resolve(__dirname, `../${filePath}`);
}
