const fs = require('fs');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const SOURCE_DIST = require('./config').SOURCE_DIST;
const MODULE_NAME = require('./config').MODULE_NAME;
module.exports = {
  getConfig: function getConfig() {
    function getFolders(dir) {
      const folders = fs.readdirSync(dir)
        .filter(function (file) {
          return fs.statSync(path.join(dir, file)).isDirectory();
        });
      const index = folders.indexOf('common');
      folders.splice(index, 1);
      return folders;
    }

    const folders = getFolders(SOURCE_DIST);

    const config = {
      entry: {},
      plugins: []
    };
    // Object.assign(config, webpackConfig);

    for (const folder of folders) {
      config.entry[folder] = `${SOURCE_DIST}/${folder}/app.js`;
      config.plugins.push(new HtmlWebpackPlugin({
        chunks: ['common', folder],
        filename: `${MODULE_NAME}/${folder}/index.html`,
        template: `${SOURCE_DIST}/${folder}/index.html`
      }));
    }

    return config;
  }
};
