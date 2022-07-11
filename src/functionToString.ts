import { NodePath, transformFromAstSync, types } from '@babel/core';

// ! arrow function currently doesn't work
export default function functionToString(
  path: NodePath<
    | types.FunctionDeclaration
    | types.FunctionExpression
    | types.ArrowFunctionExpression
  >,
) {
  let program: types.Program;
  if (path.isFunctionDeclaration()) program = types.program([path.node]);
  else if (path.isFunctionExpression())
    program = types.program([
      types.expressionStatement(path.node as types.FunctionExpression),
    ]);
  else return undefined;

  const code =
    transformFromAstSync(program, undefined, {
      filename: 'unknown.js',
    })?.code || undefined;

  if (typeof code === 'string' && code.startsWith('(') && code.endsWith?.(');'))
    return code.substring(1, code.length - 2);
  return code;
}
