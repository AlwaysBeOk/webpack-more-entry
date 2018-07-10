const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');//引入打包后的代码
const ExtractTextPlugin = require("extract-text-webpack-plugin");//将css独立引入变成link标签形式, 使用该插件需要独立下载'npm install extract-text-webpack-plugin --save-dev', 同时下面的rules也必须更改
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 删除文件


const MODULE_NAME = require('./config').MODULE_NAME;


let config = {
  output:{
    filename: `${MODULE_NAME}/[name]/scripts.js`, //设置多个文件出口，可以后面加上hash
    // path: __dirname + '/out', //内存编译不需要设置输出目录
    path: path.resolve(__dirname, 'dest'),
    // publicPath: "/",  //静态资源公共路径
    // chunkFilename: `${MODULE_NAME}/chunks/[id].js`,
  },
  mode: 'development',
  plugins:[
    new CleanWebpackPlugin(['dest']),
    new webpack.NamedModulesPlugin(),
    new ExtractTextPlugin({
      filename: `${MODULE_NAME}/[name]/style.css`,
      allChunks: true,
      disable: false
    }),
    new webpack.HotModuleReplacementPlugin(), //热部署刷新插件
    //清除文件夹再构建
    // new CleanWebpackPlugin(['*'], {
    //   root: __dirname + '/out',
    //   verbose: true,
    //   dry: false,
    //   //exclude: ["dist/1.chunk.js"]
    // }),
    //打包出html文件到out文件夹
    // new HtmlWebpackPlugin({
    //   template: './index.html'
    // })
  ],

  optimization: {
    //common 插件
    splitChunks:{
      chunks: "async",
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups:{
        jquery:{
          test:'jquery', //要写test设置项，不然会打包工程下所有的js文件
          chunks:'initial',
          name:'jquery',
          enforce:true
        },
        common: {
          name: 'common',
          chunks: 'initial',
          minChunks: 2,
          maxInitialRequests: 100,
          minSize: 0,
          enforce: true
        },
        // 公共第三方库引入
        // vendor: {
        //   test: '/node_modules/',
        //   chunks: 'initial',
        //   name: 'vendor',
        //   priority: 10,
        //   enforce: true
        // }
      }
    }
  },
  devServer: {
    contentBase: './dest', //注意这边路径不要写太详细，会导致一部分文件重新构建，页面不刷新
    watchContentBase: true,
    //因为热更新使用的是内存 默认资源是保存在内存中的 需要使用publ需要使用publishpath制定相对路径ishpath制定相对路径
    port: 8072,
    hot: true, //热更新
    hotOnly: false,
    inline: true,
    historyApiFallback: true, //跳转页面
    openPage: 'spread', //默认打开的页面
    open: true, //自动打开页面,
    clientLogLevel: "none", //阻止打印那种搞乱七八糟的控制台信息
    allowedHosts:[], //允许访问的服务器
    proxy: {
      '/api': 'http://localhost:3000'  //ajax 访问代理
    },
    watchOptions: {
      poll: true
    }
  }
};

module.exports = config;
