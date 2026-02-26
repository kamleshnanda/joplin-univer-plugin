const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  mode: process.env.NODE_ENV || 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' }
      ]
    })
  ],
  externals: {
    // Joplin API is provided by the host application
    'api': 'commonjs api',
    'api/types': 'commonjs api/types'
  },
  devtool: 'source-map',
  optimization: {
    minimize: false
  }
};
