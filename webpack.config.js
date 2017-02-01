var webpack = require('webpack');

module.exports = {
    entry: './crypto.es6',
    output: {
        path: __dirname,
        filename: 'crypto.js'
    },
    module: {
        loaders: [
            {
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        // Avoid publishing files when compilation fails
        new webpack.NoErrorsPlugin(),
		new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})
    ],
    stats: {
        // Nice colored output
        colors: true
    },
    // Create Sourcemaps for the bundle
    devtool: 'source-map'
};
