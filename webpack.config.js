const webpack = require('webpack');
const path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');

const plugins = {
	prod: [
		new UglifyJSPlugin({
			sourceMap: true,
			uglifyOptions: {
				ecma: 8,
				toplevel: true,
				compress: {
					passes: 2,
					hoist_props: true,
					ecma: 8
				},
				output: {
					comments: false
				}
			}
		}),
	],
	dev: []
};

const defaultConfig = {
	entry: {
		app: "./src/app.ts"
	},
	output: {
		path: __dirname,
		filename: "./dist/[name].min.js",
		chunkFilename: './dist/[name].part.js'
	},
	module: {
		rules: [{
			test: /\.html$/,
			use: [ {
				loader: 'html-loader',
				options: {
					attrs: [':data-src'],
					minimize: false
				}
			}],
		}, {
			test: /\.scss$/,
			use: [{
				loader: "style-loader",
			}, {
				loader: "css-loader",
				/*
				options: {
					minimize: false,
					//url: false
				}
				*/
			}, {
				loader: "sass-loader",
				/*
				options: {
					minimize: false,
					//url: false
				}
				*/
			}]
		}, {
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
		}, {
			test: /\.txt$/,
			use: 'raw-loader',
			exclude: /node_modules/,
		}],
	},
	resolve: {
		extensions: [ '.tsx', '.ts', '.js', '.scss', '.css', '.txt'],
	},
};

const config = {
	dev: Object.assign({}, defaultConfig, {
		plugins: plugins.dev,
		optimization: {
			minimize: false
		}
	}),
	prod: Object.assign({}, defaultConfig, {
		plugins: plugins.prod,
	})
};

module.exports = env => {
	return config[env || 'dev'];
};