import { NodePath, types } from '@babel/core';
import createInjectionStatement from './createInjectionStatement';

export default function createInjectionWrapper(
  path: NodePath<types.ArrowFunctionExpression | types.FunctionExpression>,
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
        createInjectionStatement(id.name, 'epic', property),
        types.returnStatement(id),
      ]),
    ),
    [],
  );
}
