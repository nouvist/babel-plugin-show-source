import { transformSync } from '@babel/core';
import babelPluginShowSource from '../src/main';

function transform(code: string) {
  return transformSync(code, {
    filename: 'unknown.ts',
    plugins: [
      babelPluginShowSource({
        removeDirective: true,
      }),
    ],
  });
}

const testingScript = `
function foo() {
  'show source';
  console.log('foo');
}

const bar = function bar() {
  'show source';
  console.log('bar');
}

const baz = () => {
  'show source';
  console.log('baz');
};

() => {
  'show source';
  console.log('no const');
}

callback(() => {
  'show source';
  console.log('callback');
})
`;

console.log(transform(testingScript)?.code);
