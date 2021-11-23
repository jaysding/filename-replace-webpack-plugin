const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FilenameReplaceWebpackPlugin = require('./plugins/filename-replace-webpack-plugin');
module.exports = {
	mode: 'development',
	entry: {
		main: './src/index.js'
	},
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
        ]
    },
	plugins: [
        new MiniCssExtractPlugin({
            filename: "/css/[name].css",
            chunkFilename: "[name].[chunckhash].css",
          }),
		new CleanWebpackPlugin(),
        new FilenameReplaceWebpackPlugin([{
            from: /main.*\.js$/, // 匹配main.*****.js
            to: 'index.ironman.js', // 修改成index.ironman.js
            // clone: true, // 为true则保留原文件
            // replace: (filename) => { // replace函数可以更精细的根据正则表达式替换文件名，参数是源文件名，返回值是新名称
            //     let reg = /^(.*)main(\.*.*)\.js$/g;
            //     return reg.test(filename) && filename.replace(reg, (match, ...p) => {
            //         return match.replace(p[1], '')
            //     })
            // }
        },{
            from: /main.*\.css$/, // 匹配main.*****.css
            to: '/css/index.spiderman.css', // 修改成index.spiderman.css
        }])
	],
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].[contenthash:4].js'
	}
}