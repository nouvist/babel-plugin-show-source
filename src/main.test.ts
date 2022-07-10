import { transformSync } from '@babel/core';
import babelPluginShowSource from './main';

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
function foobar() {
  'show source';

  console.log('hello world!');
}
`;

console.log(transform(testingScript)?.code);
