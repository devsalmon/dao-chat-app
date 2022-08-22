const webpack = require("webpack");

module.exports = function override(webpackConfig) {
  // Disable resolving ESM paths as fully specified.
  // See: https://github.com/webpack/webpack/issues/11467#issuecomment-691873586
  webpackConfig.module.rules.push({
    test: /\.mjs/,
    include: /node_modules/,
    type: "javascript/auto",
  });

  // Ignore source map warnings from node_modules.
  // See: https://github.com/facebook/create-react-app/pull/11752
  webpackConfig.ignoreWarnings = [/Failed to parse source map/];

  // Polyfill Buffer.
  webpackConfig.plugins.push(
    new webpack.ProvidePlugin({ Buffer: ["buffer", "Buffer"] })
  );

  // Polyfill other modules.
  webpackConfig.resolve.fallback = {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
    util: require.resolve("util"),
    assert: require.resolve("assert"),
    os: require.resolve("os-browserify"),
    url: require.resolve("url"),
    http: require.resolve("stream-http"),
    https: require.resolve("https-browserify"),
    fs: false,
    process: false,
    path: false,
    zlib: false,
  };

  return webpackConfig;
};
