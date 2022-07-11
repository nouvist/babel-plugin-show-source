import { TransformOptions, transformSync } from '@babel/core';
import { Script } from 'vm';
import babelPluginShowSource from '../src/main';

export function run(_code: string, opts?: TransformOptions) {
  const property = 'toString2';
  const code =
    transformSync(_code, {
      ...opts,
      filename: 'unknown.ts',
      plugins: [
        ...(opts?.plugins || []),
        babelPluginShowSource({
          property,
          removeDirective: true,
        }),
      ],
    })?.code || '';

  const injected = `
  function str(func) {
    return func.${property}();
  }
  ${code}`;

  const script = new Script(injected).runInNewContext();

  if (script === null) return [null, script];

  return [new Script(`(${script})();`).runInNewContext(), script];
}

test('FunctionDeclaration', () => {
  const num = Math.round(Math.random() * 1e4);

  const code = `
  function foobar() {
    'show source';
    return ${num};
  }
  str(foobar);`;

  const [result, resultCode] = run(code);
  console.log(resultCode);
  expect(result).toBe(num);
});

test('FunctionExpression', () => {
  const num = Math.round(Math.random() * 1e4);

  const code = `
  const foobar = function() {
    'show source';
    return ${num};
  };
  str(foobar);`;

  const [result, resultCode] = run(code);
  console.log(resultCode);
  expect(result).toBe(num);
});

test('ArrowFunctionExpression', () => {
  const num = Math.round(Math.random() * 1e4);

  const code = `
  const foobar = () => {
    'show source';
    return ${num};
  };
  str(foobar);`;

  const [result, resultCode] = run(code);
  console.log(resultCode);
  expect(result).toBe(num);
});

test('async ArrowFunctionExpression', async () => {
  const num = Math.round(Math.random() * 1e4);

  const code = `
  const foobar = async () => {
    'show source';
    return ${num};
  };
  str(foobar);`;

  const [result, resultCode] = run(code);
  console.log(resultCode);
  expect(await result).toBe(num);
});
