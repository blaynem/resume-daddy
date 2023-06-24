const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');
const { merge } = require('webpack-merge');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  // Write files to disk so we we get HMR in Chrome extensions!
  return merge(config, {
    devServer: {
      devMiddleware: {
        writeToDisk: true,
      },
    },
  });
});
