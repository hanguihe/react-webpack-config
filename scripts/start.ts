import Server from 'webpack-dev-server';
import webpack, { Configuration } from 'webpack';
import getWebpackConfig from '../config/webpack.config';
import getServerConfig from '../config/devServer';

process.env.NODE_ENV = 'development';

function start() {
  const config = getWebpackConfig('development');
  const serverConfig = getServerConfig();

  const compiler = webpack(config as Configuration);

  const server = new Server(compiler, serverConfig);

  server.listen(serverConfig.port, serverConfig.host, (err) => {
    if (err) {
      console.log(err);
      return;
    }

    console.log('start development server... \n');
  });
}

start();
