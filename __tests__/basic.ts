import { transformSync } from '@babel/core';
import { randomBytes, randomInt } from 'crypto';
import { Script } from 'vm';

export function run(_code: string, removeFunction?: boolean) {
  // differentiate to native .toString()
  const property = 'toString' + randomBytes(8).toString('hex');

  const code =
    transformSync(_code, {
      filename: 'unknown.ts',
      plugins: [
        [
          './src/main.ts',
          {
            property,
            removeFunction,
            removeDirective: true,
          },
        ],
      ],
    })?.code || '';

  const injected = `
  function str(func) {
    return func.${property}();
  }
  ${code}`;

  const script = new Script(injected).runInNewContext();

  if (script === null) return [null, code];

  return [new Script(`(${script})();`).runInNewContext(), code];
}

function createCases(num: number) {
  return [
    [
      'FunctionDeclaration',
      `
    function foobar() {
      'show source';
      return ${num};
    }
    str(foobar);`,
    ],
    [
      'async FunctionDeclaration',
      `
    async function foobar() {
      'show source';
      return ${num};
    }
    str(foobar);`,
    ],
    [
      'FunctionExpression',
      `
    const foobar = function() {
      'show source';
      return ${num};
    };
    str(foobar);`,
    ],
    [
      'ArrowFunctionExpression',
      `
    const foobar = () => {
      'show source';
      return ${num};
    };
    str(foobar);`,
    ],
    [
      'async ArrowFunctionExpression',
      `
    const foobar = async () => {
      'show source';
      return ${num};
    };
    str(foobar);`,
    ],
  ];
}

const num = randomInt(1000, 9999);

describe.each(createCases(num))('function %p', (_, code: string) => {
  test.each([true, false])(
    'removeFunction %p',
    async (removeFunction: boolean) => {
      const [result, resultCode] = run(code, removeFunction);
      console.log(resultCode);
      expect(await result).toBe(num);
    },
  );
});
