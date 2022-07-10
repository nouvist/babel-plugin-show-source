# :sparkles: babel-plugin-show-source :sparkles:

Babel Plugin for `"show source"` directive in order to make `Function.prototype.toString()` always available, even on bytecode JS.

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

## How this plugin works

This plugin will add explicit `toString()` function to any function that using the `"show source"` directive.

```js
// from
function myFunction() {
  'show source';
  return 1337;
}
// to
function myFunction() {
  'show source';
  return 1337;
}
myFunction.toString = function () {
  return 'function myFunction() {\n  "show source";\n  return 1337;\n}';
};
```

## Usage

In order to use this plugin, you could simply use the `"show source"` directive in your function.

```js
//babel.config.js
const babelPluginShowSource = require('babel-plugin-show-source');

module.exports = {
  plugins: [
    babelPluginShowSource({
      // options here
      // although, you can leave it undefined
    }),
  ],
};
```

```js
function fibonacci(num) {
  'show source';

  if (num <= 2) return 1;
  else return fibonacci(num - 2) + fibonacci(num - 1);
}
```

## License

The MIT License
