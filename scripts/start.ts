import Server from 'webpack-dev-server';
import webpack from 'webpack';
import getWebpackConfig from '../config/webpack.config';
import getServerConfig from '../config/devServer';

process.env.NODE_ENV = 'development';

const config = getWebpackConfig('development');
const serverConfig = getServerConfig();

const compiler = webpack(config);

const server = new Server(compiler, serverConfig);

compiler.hooks.invalid.tap('invalid', () => {
  console.log('compiling...');
});

compiler.hooks.done.tap('done', (stats) => {
  const json = stats.toJson({ all: false, errors: true, warnings: true });

  if (Array.isArray(json.errors) && json.errors.length > 0) {
    console.error('fail to compile..');
    json.errors.forEach((item) => {
      console.error(item.moduleName);
      console.error(item.message);
    });
    return;
  }

  if (Array.isArray(json.warnings) && json.warnings.length > 0) {
    console.warn('compile with warnings..');
    console.warn(json.warnings.join('\n'));
  }

  console.log('success to compile \n');
});

server.listen(serverConfig.port || 3000, serverConfig.host || 'localhost', (err) => {
  if (err) {
    console.log(err);
    return;
  }

  console.log('start development server... \n');
});
