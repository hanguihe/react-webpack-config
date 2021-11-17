import fs from 'fs-extra';
import Webpack from 'webpack';
import { getWebpackConfig } from './webpack';
import { resolve, convertTime, convertBundleSize } from './utils';

async function build() {
  console.log('start bundle with webpack...');
  process.env.NODE_ENV = 'production';

  console.log('clean dist directory');
  fs.removeSync(resolve('dist'));

  console.log('start to compile...');

  const compiler = Webpack(getWebpackConfig('production'));

  compiler.run((err, stats) => {
    if (err) {
      console.error('compile with errors');
      throw err;
    }

    const info = stats?.toJson() || {};

    if (Array.isArray(info.errors) && info.errors.length > 0) {
      console.error('compile with errors');
      info.errors.forEach((item) => {
        console.error(item.moduleName);
        console.log(item.message);
      });
      process.exit(1);
    }

    if (Array.isArray(info.warnings) && info.warnings.length > 0) {
      console.warn('compile with warnings');
      info.warnings.forEach((item) => {
        console.warn(item.moduleName);
        console.log(item.message);
      });
    }

    console.log(`compile success in ${convertTime(info.time)}`);

    console.log('copy public files');
    fs.copySync(resolve('public'), resolve('dist'), {
      dereference: true,
      filter: (file: string) => !file.includes('index.html'),
    });

    if (Array.isArray(info.assets) && info.assets.length > 0) {
      const res = info.assets.map((item) => ({
        name: item.name,
        type: item.type,
        size: convertBundleSize(item.size),
      }));

      console.table(res);
    }
  });
}

build().catch((err) => {
  console.log(err);
  process.exit(1);
});
