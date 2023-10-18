const path = require('path');
const packageJsonInfo = require('./package.json');
const CopyPlugin = require("copy-webpack-plugin");

/**
 * whole webpack configuration
 * https://webpack.js.org/configuration/
 */

module.exports = (env) => {
    env.prod = env.prod || false;

    let config = {
        entry: {
            main: {
                import: [
                    './src/Root.js',
                    './src/index.js'
                ]
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        'css-loader'
                    ]
                }
            ],
        },
        resolve: {
            extensions: ['.js'],
        },
        output: {
            filename: packageJsonInfo.name + '.js',
            path: path.resolve(__dirname, `dist`),
            clean: true,
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, `index_dist.html`),
                        to: path.resolve(__dirname, `dist/index.html`),
                        toType: "file",
                    },
                    {
                        from: path.resolve(__dirname, `sw.js`),
                        to: path.resolve(__dirname, `dist/sw.js`),
                        toType: "file",
                    },
                    {
                        from: path.resolve(__dirname, `manifest.json`),
                        to: path.resolve(__dirname, `dist/manifest.json`),
                        toType: "file",
                    },
                ],
            }),
        ],
    };

    if (env.prod) {
        config.mode = "production";
    } else {
        config.mode = "development";
    }

    return config;
}
