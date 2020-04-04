const webpack = require('webpack');
const path = require('path');

const TerserPlugin = require('terser-webpack-plugin');
const JavaScriptObfuscator = require('webpack-obfuscator');

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
		optimization: {
			minimize: false
		}
	}),
	prod: Object.assign({}, defaultConfig, {
		optimization: {
			minimize: true,
			minimizer: [new TerserPlugin()],
		},
	})
};

module.exports = env => {
	console.log('ENV: ', env);
	return config[env || 'dev'];
};