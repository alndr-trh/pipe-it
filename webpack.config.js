const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'production',
  // mode: 'development',
  // devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },

  entry: './src/main.ts',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|jpeg)$/i,
        type: 'asset/inline',
        parser: {
          dataUrlCondition: {
            maxSize: true,
          },
        },
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      scriptLoading: 'blocking',
    }),
    new HtmlInlineScriptPlugin(),
    // new CopyPlugin({
    //   patterns: [
    //     { from: 'public', to: 'public' },
    //   ],
    // }),
  ],
};
