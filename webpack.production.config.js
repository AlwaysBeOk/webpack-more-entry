const path = require('path');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin')//代码压缩

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 删除文件
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");//css 压缩文件
const MODULE_NAME = require('./config').MODULE_NAME;
const BUILD_DIST = require('./config').BUILD_DIST;

let config = {
  output:{
    filename: `${MODULE_NAME}/[name]/index.[chunkhash:8].js`, //设置多个文件出口，可以后面加上hash
    path: path.join(__dirname, BUILD_DIST),
    publicPath: "../../"   //静态资源公共路径
  },
  mode: 'production',
  devtool: 'source-map',
  plugins:[
    //清除文件夹再构建
    new CleanWebpackPlugin(['*'], {
      root: __dirname + '/dest',
      verbose: true,
      dry: false,
      //exclude: ["dist/1.chunk.js"]
    }),
    //打包出css文件到out文件夹
    new ExtractTextPlugin({
      filename: `${MODULE_NAME}/[name]/index.[chunkhash:8].css`,
      allChunks: true,
      disable: false
    }),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /index\.[a-z 0-9]{8}\.css$/g, //匹配到out文件夹中css进行压缩
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: false
    }),

  ],
  optimization: {
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
    },
    //压缩js
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: false
        }
      })
    ]
  }
};

module.exports = config;
