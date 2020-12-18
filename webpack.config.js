var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var WebpackShellPlugin = require('webpack-shell-plugin');


const accessKeyId = path.resolve(`${__dirname}/etc`, 'accessKeyId.txt');
const secretAccessKey = path.resolve(`${__dirname}/etc`, 'secretAccessKey.txt');

function accessKeyIdValue() {
    return fs.readFileSync(accessKeyId).toString();
}

function secretAccessKeyValue() {
    return fs.readFileSync(secretAccessKey).toString();
}

module.exports = [{
    target: "web",
    watch: true,
    devtool: 'inline-source-map',
    entry: {
        admin: './src/admin/index.js',
        index: './src/index.js',
        waitingroom: './src/waitingroom.js',
        kinesis: './src/kinesis/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'public/javascripts/'),
        filename: '[name].bundle.js'
    },
    plugins: [
        new WebpackShellPlugin({onBuildStart:['echo "Webpack Start"'], onBuildEnd:['nodemon ./bin/www']}),
        new webpack.DefinePlugin({
            ACCESS_KEY_ID: webpack.DefinePlugin.runtimeValue(accessKeyIdValue, [accessKeyId]),
            SECRET_ACCESS_KEY: webpack.DefinePlugin.runtimeValue(secretAccessKeyValue, [secretAccessKey])
        })
    ],
     module: {
    rules: [
      {
        test: /\.css$/,
        //exclude: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      }
    ]
  }
    }
];