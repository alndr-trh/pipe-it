const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',

  plugins: [
    new HTMLInlineCSSWebpackPlugin(),
    new HtmlInlineScriptPlugin(),
  ],
});
