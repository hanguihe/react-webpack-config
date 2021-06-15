## webpack 配置 demo

#### 快速开始

1. 打包

```bash
$ npm run build
```

2. 开发

```bash
$ npm run start
```

#### 如何做构建速度优化？

- babel-loader 开启缓存：babel-loader?cacheDirectory
- 使用 cache-loader
- resolve 解析配置直接指明第三方模块位置，extensions 文件后缀配置优化
- DllPlugin 提前编译第三方依赖
- 第三方依赖配置 externals 以及 cdn
- 开启多进程 loader 转换如配置 HappyPack
- 使用 esbuild 插件压缩代码
