import fs from 'fs-extra';
import webpack, { Configuration } from 'webpack';
import config from '../config/webpack.config';

process.env.NODE_ENV = 'production';

const compiler = webpack(config('production') as Configuration);

console.log('clean dist directory');
fs.emptyDirSync('dist');

console.log('copy public files');
fs.copySync('public', 'dist', {
  dereference: true,
  filter: (file: string) => {
    console.log(file);
    return file !== 'public/index.html';
  },
});

console.log('start bundle...');

compiler.run((err, stats) => {
  if (err) {
    console.log(1);
    process.exit(0);
  }
});
