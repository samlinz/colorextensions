const path = require("path");
const webpack = require("webpack");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WebpackCopyAfterBuildPlugin = require("webpack-copy-after-build-plugin");
const npmPackage = require("./package.json");

module.exports = {
    mode: "development",
    entry: {
        colorextensions: "./src/index.js"
    },
    output: {
        filename: "colorextensions.min.js",
        path: path.resolve(__dirname, "build"),
        library: "ColorExtensions",
        globalObject: "this",
        // libraryExport: "default",
        libraryTarget: "umd"
    },
    // devtool: "inline-source-map",
    devServer: {
        contentBase: "./build",
        hot: true
    },
    plugins: [
        //new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from: "static",
                copyUnmodified: true
            }
        ]),
        new webpack.BannerPlugin({
            entryOnly: true,
            banner: () =>
                `${npmPackage.name} ${
                    npmPackage.version
                }, built on ${new Date()}`
        }),
        new WebpackCopyAfterBuildPlugin({
            colorextensions: "../colorextensions.min.js"
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }
        ]
    }
};
