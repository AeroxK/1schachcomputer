const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
  return {
    mode: env.NODE_ENV,
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
            { test: /\.html$/i, include: path.resolve(__dirname, 'src/frontend'), loader: 'html-loader' },
            { test: /\.(sa|sc|c)ss$/i, use: ['style-loader', 'css-loader', 'sass-loader'] },
            {
                test: /\.tsx?$/i,
                use: [{
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: env.NODE_ENV === 'production'
                        }
                    }]
                },
            { test: /\.(png|svg|jpg|jpeg|gif)$/i, include: path.resolve(__dirname, 'src/frontend'), type: 'asset/resource' },
            { test: /\.(woff|woff2|eot|ttf|otf)$/i, type: 'asset/resource' },
            { test: /\.webm$/i, include: path.resolve(__dirname, 'src/frontend'), loader: 'file-loader' },
        ],
    },
  };
} 
