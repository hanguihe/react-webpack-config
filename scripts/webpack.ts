import { Configuration, HotModuleReplacementPlugin, RuleSetUseItem } from 'webpack';
import { Configuration as ServerConfig } from 'webpack-dev-server';
import { ESBuildMinifyPlugin } from 'esbuild-loader';
import MiniCSSExtraPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import config from './config';
import { getBabelConfig } from './babel';
import { resolve } from './utils';

type ENV_MODE = 'production' | 'development';

export function getServerConfig(): ServerConfig {
  return {
    compress: true,
    client: {
      logging: 'none',
      overlay: true,
      progress: false,
    },
    static: {
      directory: config.outDir,
      watch: true,
    },
    devMiddleware: {
      stats: 'errors-only',
    },
    open: false,
    port: config.port,
    proxy: {
      ...config.proxy,
    },
    // 扩展mock配置在这里
    // onBeforeSetupMiddleware: (server) => {
    // },
  };
}

export function getWebpackConfig(mode: ENV_MODE): Configuration {
  const isDevelopment = mode === 'development';

  return {
    mode: mode,
    devtool: isDevelopment ? 'cheap-module-source-map' : false,
    bail: true,
    entry: config.entry,
    output: {
      clean: true,
      path: config.outDir,
      filename: isDevelopment ? 'bundle.js' : 'bundle.[contenthash:8].js',
    },
    optimization: {
      minimize: !isDevelopment,
      minimizer: [
        new ESBuildMinifyPlugin({
          target: 'es2015',
          css: true,
        }),
      ],
    },
    performance: false,
    resolve: {
      modules: ['node_modules'],
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      alias: {
        '@': resolve('src'),
      },
    },
    cache: {
      type: 'filesystem',
    },
    module: {
      strictExportPresence: true,
      rules: [
        {
          oneOf: [
            {
              test: /\.(ts|tsx|js|jsx)$/,
              loader: require.resolve('babel-loader'),
              include: resolve('src'),
              options: { ...getBabelConfig(isDevelopment) },
            },
            {
              test: /\.css$/,
              use: [...getStyleLoaders(isDevelopment)],
            },
            {
              test: /\.less$/,
              use: [...getStyleLoaders(isDevelopment, 'less')],
            },
            {
              exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              type: 'asset/resource',
            },
          ],
        },
      ],
    },
    plugins: [
      new HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin(),
      new HtmlWebpackPlugin({
        inject: true,
        template: resolve('public/index.html'),
      }),
      new MiniCSSExtraPlugin({
        filename: 'style.[contenthash:8].css',
        chunkFilename: 'style.[contenthash:8]-chunk.css',
      }),
    ],
  } as Configuration;
}

function getStyleLoaders(isDevelopment: boolean, type: 'css' | 'less' = 'css') {
  return [
    isDevelopment && {
      loader: require.resolve('style-loader'),
    },
    !isDevelopment && {
      loader: MiniCSSExtraPlugin.loader,
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
    type === 'less' && {
      loader: require.resolve('less-loader'),
      options: {
        lessOptions: {
          modifyVars: {
            ...config.themes,
          },
          javascriptEnabled: true,
        },
      },
    },
  ].filter(Boolean) as RuleSetUseItem[];
}
