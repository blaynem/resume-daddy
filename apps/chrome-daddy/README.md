## Setup for Chrome Extension

This is going to serve as my reminder for how I got Nx + React to work for Chrome Extensions.

1. Generate a new Nx App with React w/ Webpack
2. Add a `manifest.json` file inside the `/src` folder. This is required for all Chrome Extensions.
3. In `project.json` under `targets.build.options.assets` we add the manifest.json file path. This is so the build process will copy the manifest file to the dist folder.
4. Inside of `webpack.config.js` we add the devServer to writeToDisk. This is due to nx writing everything to memory and not to disk. This is required for Chrome Extensions to work with HMR.

```js
// Before
const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), withReact(), (config) => {
  // Write files to disk so we we get HMR in Chrome extensions!
  return config;
});

// After
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
```

5. Now we can run `nx serve chrome-daddy` which will build the app inside `dist/apps`.
6. Visit `chrome://extensions/`, click `Load unpacked`, find and select the `dist/apps/chrome-daddy` folder.
7. Now your chrome extension should be loaded into your browser. You can make changes to the code and it will automatically reload the extension!
