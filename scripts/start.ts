import Webpack from 'webpack';
import Server from 'webpack-dev-server';
import { getServerConfig, getWebpackConfig } from './webpack';
import { convertTime } from './utils';

async function start() {
  console.log('start development server with webpack server...');

  process.env.NODE_ENV = 'development';

  const compiler = Webpack(getWebpackConfig('development'));
  const server = new Server(getServerConfig(), compiler);

  // 监听重新编译事件
  compiler.hooks.invalid.tap('invalid', () => {
    console.log('start compile...');
  });

  // 监听编译完成事件
  compiler.hooks.done.tap('done', (stats) => {
    const info = stats?.toJson({
      all: false,
      errors: true,
      warnings: true,
      timings: true,
    });

    if (Array.isArray(info.errors) && info.errors.length > 0) {
      console.error('fail to compile');

      info.errors.forEach((item) => {
        console.error(item.moduleName);
        console.log(item.message);
      });
      return;
    }

    if (Array.isArray(info.warnings) && info.warnings.length > 0) {
      console.warn('compile with warnings');
      info.warnings.forEach((item) => {
        console.warn(item.moduleName);
        console.log(item.message);
      });
    }

    console.log(`success to compile with ${convertTime(info.time)} \n`);
  });

  await server.start();
}

start().catch(() => {
  process.exit(1);
});
