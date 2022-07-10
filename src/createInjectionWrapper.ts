import { NodePath, types } from '@babel/core';
import createInjectionStatement from './createInjectionStatement';

export default function createInjectionWrapper(
  path: NodePath<types.ArrowFunctionExpression | types.FunctionExpression>,
  funcCode: string | undefined,
  property: string,
) {
  const id = types.identifier('f');
  return types.callExpression(
    types.functionExpression(
      undefined,
      [],
      types.blockStatement([
        types.variableDeclaration('const', [
          types.variableDeclarator(id, path.node),
        ]),
        createInjectionStatement(id.name, funcCode, property),
        types.returnStatement(id),
      ]),
    ),
    [],
  );
}
