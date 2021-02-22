const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/frontend/index.tsx'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist/assets'),
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src/frontend/index.html'),
    }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
      rules: [
          { test: /\.html$/i, loader: 'html-loader' },
          { test: /\.css$/i, use: ['style-loader', 'css-loader'] },
          { test: /\.tsx?$/i, use: 'ts-loader' },
          { test: /\.(png|svg|jpg|jpeg|gif)$/i, type: 'asset/resource' },
          { test: /\.(woff|woff2|eot|ttf|otf)$/i, type: 'asset/resource' },
      ],
  },
};
