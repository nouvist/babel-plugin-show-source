import { transformSync } from '@babel/core';
import { Script } from 'vm';
import babelPluginShowSource from '../src/main';

function run(_code: string, transform?: boolean) {
  let code: string;
  if (transform)
    code =
      transformSync(_code, {
        filename: 'unknown.ts',
        plugins: [
          babelPluginShowSource({
            removeDirective: true,
          }),
        ],
      })?.code || '';
  else code = _code;

  const injected = `
  // simulate no Function.prototype.toString();
  Function.prototype.toString = () => null;
  function str(func) {
    return func.toString();
  }
  ${code}`;

  const script = new Script(injected).runInNewContext();

  try {
    return new Script(`(${script})();`).runInNewContext();
  } catch {
    return null;
  }
}

test('FunctionDeclaration', () => {
  const num = Math.round(Math.random() * 1e4);

  const code = `
  function foobar() {
    'show source';
    return ${num};
  }
  str(foobar);`;

  expect(run(code)).toBe(null);
  expect(run(code, true)).toBe(num);
});

test('FunctionExpression', () => {
  const num = Math.round(Math.random() * 1e4);

  const code = `
  const foobar = function() {
    'show source';
    return ${num};
  };
  str(foobar);`;

  expect(run(code)).toBe(null);
  expect(run(code, true)).toBe(num);
});

test('ArrowFunctionExpression', () => {
  const num = Math.round(Math.random() * 1e4);

  const code = `
  const foobar = () => {
    'show source';
    return ${num};
  };
  str(foobar);`;

  expect(run(code)).toBe(null);
  expect(run(code, true)).toBe(num);
});
