import { join } from 'path';
import { Configuration } from 'webpack-dev-server';
import mockServer from './mock';

export default () => {
  return {
    // 允许访问本地服务的白名单
    allowedHosts: [],
    // 开启GZIP压缩
    compress: true,
    // 控制台不显示HMR日志
    clientLogLevel: 'debug',
    // 当contentBase内容变更后刷新页面
    contentBase: join(__dirname, '../dist'),
    watchContentBase: true,
    // 为所有请求添加响应头
    headers: {},
    // // 404请求响应index内容 默认false
    historyApiFallback: false,
    // 启动服务域 允许外部访问时配置 0.0.0.0
    host: 'localhost',
    // 开启模块热替换
    hot: true,
    hotOnly: false,
    noInfo: true,
    // 自动打开浏览器
    open: false,
    // 默认端口号
    port: 3000,
    // API代理
    proxy: {},
    // 是否允许使用本地IP打开
    useLocalIp: false,
    before: (app) => {
      if (process.env.MOCK) {
        mockServer(join(__dirname, '../mock'), app);
      }
    },
  } as Configuration;
};
