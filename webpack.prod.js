const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',

  plugins: [
    new HtmlInlineScriptPlugin(),
  ],
});
