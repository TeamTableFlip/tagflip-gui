const Webpack = require("webpack");
const dotenv = require('dotenv').config({ path: '.webpack.env' });
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ASSET_PATH = process.env.ASSET_PATH || '/';

const babelOptions = {
    "presets": [
        "@babel/react",
        "@babel/preset-env"
    ]
};

module.exports = {
    cache: true,
    entry: {
        main: './src/index.tsx',
        vendor: [
            'babel-polyfill',
            'events',
            'react',
            'react-dom',
            'react-redux'
        ]
    },
    output: {
        publicPath: ASSET_PATH
    },
    devServer: {
        historyApiFallback: true,
    },
    devtool: 'source-map',
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelOptions
                    },
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: babelOptions
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: "html-loader"
                    }
                ]
            },
            {
                test: /\.(sass|scss|css)$/i,
                use: [
                    //'file-loader',
                    // Creates `style` nodes from JS strings
                    //{ loader: 'style-loader', options: { injectType: 'linkTag' } },
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                    //'extract-loader',
                ],
            }
        ]
    },
    /*  externals: {
          "react": "React",
          "react-dom": "ReactDOM"
      },
      */
    plugins: [
        new Webpack.DefinePlugin({
            'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
            BASENAME: JSON.stringify(ASSET_PATH)
        }),
        new Webpack.DefinePlugin({
            "process.env": dotenv.parsed
        }),
        new HtmlWebPackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            favicon: "./src/favicon.ico"
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ]
};
