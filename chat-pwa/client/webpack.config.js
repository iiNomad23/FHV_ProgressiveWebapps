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
            Main: {
                import: [
                    './src/Root.js',
                ]
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/
                },
            ],
        },
        resolve: {
            extensions: ['.js'],
        },
        output: {
            filename: packageJsonInfo.name + '.js',
            path: path.resolve(__dirname, `dist/lib/js`),
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, `index_dist.html`),
                        to: path.resolve(__dirname, `dist/index.html`),
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
