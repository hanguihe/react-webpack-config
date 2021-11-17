import { resolve } from './utils';

export default {
  entry: resolve('src/app.tsx'),
  outDir: resolve('dist'),
  port: 3000,
  proxy: {},
  themes: {},
};
