<h1 align="center">
  babel-plugin-show-source 
</h1>

[![npm](https://img.shields.io/npm/v/babel-plugin-show-source)](https://npmjs.com/package/babel-plugin-show-source)
[![GitHub](https://img.shields.io/github/license/nouvist/babel-plugin-show-source)](https://github.com/nouvist/babel-plugin-show-source)

Babel plugin for `"show source"` directive in order to make `Function.prototype.toString()` always available, even on bytecode JS.

> Note: this plugin will stringify your function using Babel transform which means that it also includes polyfill you are using.

## Table of contents

- [Table of contents](#table-of-contents)
- [Installation](#installation)
  - [Options](#options)
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
//babel.config.js
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

### Options

| Name            | Type    | default         | Description                    |
| --------------- | ------- | --------------- | ------------------------------ |
| removeDirective | boolean | `false`         | remove the directive on output |
| directive       | string  | `'show source'` | directive string               |
| property        | string  | `'toString'`    | property name                  |

## Usage

In order to use this plugin, you could simply use the `"show source"` directive in your function.

```js
function fibonacci(num) {
  'show source';
  if (num <= 2) return 1;
  else return fibonacci(num - 2) + fibonacci(num - 1);
}
```

## License

The MIT License
