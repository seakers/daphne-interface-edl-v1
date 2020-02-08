'use strict';

const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devServer: {
        host: '127.0.0.1',
        historyApiFallback: true,
        noInfo: false,
        proxy: {
            '/api': {
                proxyTimeout: 1000 * 60 * 10,
                timeOut: 1000 * 60 * 10,
                target: 'http://localhost:8000/',
                changeOrigin: true,
                ws: true
            },
            '/static': {
                target: 'http://localhost:8000/',
                changeOrigin: true,
                ws: true
            }
        }
    },
});
