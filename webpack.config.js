var path = require('path');
var webpack = require('webpack');
var WebpackShellPlugin = require('webpack-shell-plugin');

module.exports = {
    target: "web",
    watch: true,
    entry: {
        index: './src/index.js',
        rooms: './src/rooms.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/javascripts/'),
        filename: '[name].bundle.js'
    },
    plugins: [
        new WebpackShellPlugin({onBuildStart:['echo "Webpack Start"'], onBuildEnd:['nodemon ./bin/www']})
    ],
};