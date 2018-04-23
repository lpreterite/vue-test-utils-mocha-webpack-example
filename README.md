# vue-test-utils-mocha-example

> Example project using mocha-webpack and vue-test-utils

This is based on the `vue-cli` `webpack-simple` template. Test-specific changes include:

### Additional Dependencies

- `vue-test-utils`
- `mocha` & `mocha-webpack`
- `jsdom` & `jsdom-global` (for setting up DOM environment in tests)
- `webpack-node-externals` (for excluding NPM deps from test bundle)
- `expect` (for assertions)
  - This is the package used internally by Jest, so [usage is the same](http://facebook.github.io/jest/docs/en/expect.html#content). You can also use [chai](http://chaijs.com/) + [sinon](http://sinonjs.org/).
- `nyc` & `babel-plugin-istanbul` (for coverage)

### Additional Configuration

#### `package.json`

Added `test` script and setting for `nyc`:

``` js
{
  // ...
  "scripts": {
    // ...
    "test": "cross-env NODE_ENV=test nyc mocha-webpack --webpack-config webpack.config.js --require test/setup.js test/**/*.spec.js"
  },
  "nyc": {
    "include": [
      "src/**/*.(js|vue)"
    ],
    "instrument": false,
    "sourceMap": false
  }
}
```

#### `webpack.config.js`

Added test-specific configs:

``` js
if (process.env.NODE_ENV === 'test') {
  // exclude NPM deps from test bundle
  module.exports.externals = [require('webpack-node-externals')()]
  // use inline source map so that it works with mocha-webpack
  module.exports.devtool = 'inline-cheap-module-source-map'
}
```

#### `test/setup.js`

Global setup for tests. This is run first with `mocha-webpack`'s `--require` flag.

``` js
// setup JSDOM
require('jsdom-global')()

// make expect available globally
global.expect = require('expect')
```

#### `.babelrc`

Added `"plugins": ["istanbul"]`:

```js
{
  "env": {
    // ...
    "test": {
      "plugins": ["istanbul"]
    }
  }
}
```

## VSCode setting

### First step：add VSCode specific setups in webpack

```js
// # webpack.config.js

// test specific setups
if (process.env.NODE_ENV === 'test') {
  module.exports.externals = [require('webpack-node-externals')()]

  //If you would to use breakpoint in vscode, then must be set devtool to "eval"
  module.exports.devtool = 'eval'
  module.exports.output = Object.assign(module.exports.output, {
    devtoolModuleFilenameTemplate: "[absolute-resource-path]",
    devtoolFallbackModuleFilenameTemplate: "[absolute-resource-path]?[hash]"
  });
}
```

### Second step：add launch configuration snippets

```json
{
    "type": "node",
    "request": "launch",
    "name": "Mocha-webpack Tests",
    "program": "${workspaceFolder}/node_modules/mocha-webpack/bin/mocha-webpack",
    "args": [
        "-u",
        "tdd",
        "--full-trace",
        "--timeout",
        "999999",
        "--colors",
        "--webpack-config",
        "webpack.config.js",
        "--require",
        "test/setup.js",
        "test/**/*.spec.js"
    ],
    "sourceMaps": true,
    "env": {
        "NODE_ENV": "test"
    },
    "internalConsoleOptions": "openOnSessionStart"
},
```

more see [.vscode/launch.json](./vscode/launch.json)

Now you can debug in VSCode.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm test
```

For detailed explanation on how things work, consult the [docs for vue-test-utils](https://vue-test-utils.vuejs.org/en/guides/testing-SFCs-with-mocha-webpack.html).
