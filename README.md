<h1 align="center">
  babel-plugin-show-source 
</h1>

[![npm](https://img.shields.io/npm/v/babel-plugin-show-source)](https://npmjs.com/package/babel-plugin-show-source)
[![GitHub](https://img.shields.io/github/license/nouvist/babel-plugin-show-source)](https://github.com/nouvist/babel-plugin-show-source)

Babel plugin for `"show source"` directive in order to make `Function.prototype.toString()` always available, even on bytecode JS.

## Table of contents

- [Table of contents](#table-of-contents)
- [Installation](#installation)
  - [Options](#options)
  - [With React Native Hermes](#with-react-native-hermes)
- [Usage](#usage)
- [License](#license)

## Installation

This module is Babel plugin. That way, assumed you have installed Babel. In order to install this plugin, you could easily install it from NPM registry.

```bash
# npm
npm install -D babel-plugin-show-source
# yarn
yarn add -D babel-plugin-show-source
# pnpm
pnpm add -D babel-plugin-show-source
```

And then, add this module to your Babel config.

```js
// babel.config.js
module.exports = {
  plugins: [
    'babel-plugin-show-source',
    // or with options
    [
      'babel-plugin-show-source',
      {
        removeDirective: true,
      },
    ],
  ],
};
```

### With React Native Hermes

React Native Hermes does have native implementation for it, but it doesn't work as expected just yet. See [issue#612](https://github.com/facebook/hermes/issues/612). This plugin initiated as alternative to Hermes built in implementation and as temporary solution to it. If you want to use it with Hermes, you should change the directive other than `'show source'`, otherwise it will conflicting with Hermes and make inconsistent result.

```js
// babel.config.js in React Native project
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'babel-plugin-show-source',
      {
        directive: 'show source please',
        // change the directive when in use with hermes
      },
    ],
  ],
};
```

### Options

| Name            | Type    | default         | Description                                                                  |
| --------------- | ------- | --------------- | ---------------------------------------------------------------------------- |
| removeDirective | boolean | `false`         | remove the directive on the output                                           |
| removeFunction  | boolean | `false`         | return as object with `toString()` method without the full callable function |
| directive       | string  | `'show source'` | directive string                                                             |
| property        | string  | `'toString'`    | property name                                                                |

> **Note**: FunctionDeclaration sometimes throw an Error, it is recommended to set `removeFunction` as `true`.

## Usage

In order to use this plugin, you could simply use the `"show source"` directive in your function.

```js
function fibonacci(num) {
  'show source';
  // use the specified directive
  if (num <= 2) return 1;
  else return fibonacci(num - 2) + fibonacci(num - 1);
}
```

## License

MIT License
