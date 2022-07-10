import { transformFromAstSync, types } from '@babel/core';

export function functionDeclarationToString(node: types.FunctionDeclaration) {
  const programNode = types.program([node]);

  return (
    transformFromAstSync(programNode, undefined, {
      filename: 'unknown.js',
    })?.code ?? undefined
  );
}
