var webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './www/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'www/dist')
  },
  module: {
    rules: [
        { 
          test: /\.js$/, 
          exclude: [/node_modules/, /onsenui\.js/], 
          loader: "babel-loader",
          query:
          {
            presets:['es2015', 'react']
          }
        }
    ]
  }
};
