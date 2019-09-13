const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
//const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const npmPackage = require("./package.json");

module.exports = {
    mode: "development",
    entry: {
        colorextensions: "./src/colorextensions.js"
    },
    output: {
        filename: "[name].min.js",
        path: path.resolve(__dirname, "build")
    },
    devtool: "inline-source-map",
    devServer: {
        contentBase: "./build"
    },
    plugins: [
        //new CleanWebpackPlugin(),
        new CopyWebpackPlugin([
            {
                from: "static",
                copyUnmodified: false
            }
        ]),
        new webpack.BannerPlugin({
            entryOnly: true,
            banner: () =>
                `${npmPackage.name} ${
                    npmPackage.version
                }, built on ${new Date()}`
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
