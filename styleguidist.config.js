const { version } = require('./package.json');

module.exports = {
  title: 'Styleguidist Tutorial',
  version,
  components: 'src/components/TestStyleguidist.js',
  ignore: ['node_modules/**'],
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    }
  }
};
