const server = {
  // 允许访问本地服务的白名单
  allowedHosts: [],
  // 开启GZIP压缩
  compress: true,
  // 控制台不显示HMR日志
  clientLogLevel: 'none',
  // 当contentBase内容变更后刷新页面
  watchContentBase: true,
  // 为所有请求添加响应头
  headers: {},
  // 404请求响应index内容 默认false
  historyApiFallback: false,
  // 启动服务域 允许外部访问时配置 0.0.0.0
  host: 'localhost',
  // 开启模块热替换
  hot: true,
  hotOnly: false,
  // 自动打开浏览器
  open: false,
  // 构建错误后是否全屏显示错误信息
  overlay: true,
  // 默认端口号
  port: 3000,
  // API代理
  proxy: {},
  stats: 'none',
  // 是否允许使用本地IP打开
  useLocalIp: false,
  // 其他项
  // before: () => {},
  // after: () => {},
};

module.exports = server;
