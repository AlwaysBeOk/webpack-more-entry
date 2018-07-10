const webpackMerge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config');

module.exports = (env, argv)=>{
  let config = {};

  if (argv.mode === 'development') {
    let dev = require('./webpack.development.config')
    config = webpackMerge(dev,webpackBaseConfig);
  }
  if (argv.mode === 'production') {
    let pro = require('./webpack.production.config');
    config = webpackMerge(pro,webpackBaseConfig);
  }
  return config;
};
