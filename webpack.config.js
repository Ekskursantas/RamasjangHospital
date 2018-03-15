var webpack = require("webpack");
var path = require('path');

module.exports = {
    entry: {
        main: ['./src/Main']
    },

    output: {
        path: path.join(__dirname, "dist_folder/scripts"), 
        filename: "main.min.js",
        sourceMapFilename: "debug/[name].map",
        library: 'EntryPoint'
    },

    // Source maps support (or 'inline-source-map' also works)
    devtool: 'source-map',

    resolve: {
        root: path.join(__dirname),
        // Allow to omit extensions when requiring these files
        extensions: ['', '.ts', '.webpack.js', '.web.js', '.js'],
        modulesDirectories: ['node_modules']
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: "ts-loader"
            }
        ]
    },

    // plugins: [
    //      new webpack.optimize.UglifyJsPlugin({
    //          compress: {
    //              warnings: false
    //          }
    //      })
    //  ],

    externals: [
        // Don't bundle pixi.js, assume it'll be included in the HTML via a script
        // tag, and made available in the global variable PIXI.
        {"pixi.js": "PIXI"}
    ]

};