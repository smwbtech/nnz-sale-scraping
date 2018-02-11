const path = require('path');

module.exports = {
    entry: './src/App.js',
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, 'public/js')
    },

    devtool: 'source-map',
    watch: true,
    watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },

    //Лоадеры
    module: {
        rules: [
            {
                test: /\.vue$/,
                // loader: 'vue-loader'
                use: ['vue-loader']
            },

            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },

            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            context: 'public',
                            name: '../img/[name].[ext]',
                            publicPath: 'img/',
                        }
                    }
                ]
            },

            // {
            // test: /\.(png|jpg|gif|svg)$/,
            //     use: [
            //         {
            //             loader: 'url-loader',
            //             options: {
            //                 limit: 8192
            //             }
            //         }
            //     ]
            // },


            {
               test: /\.css$/,
               use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1
                            }
                        },
                        {
                            loader: 'postcss-loader'
                        }

                    ],
               // options: { minimize: true }
            }

        ]
    }
}
