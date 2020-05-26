const _path = require('path');
const { HotModuleReplacementPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	plugins: [new MiniCssExtractPlugin()],
	entry: _path.join(__dirname, 'src/main.js'),
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							hmr: true,
						},
					},
					'css-loader',
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin(),
		new HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			title: 'mini-css-extract-plugin demo',
		}),
	],
	devServer: {
		hotOnly: true,
	},
};
