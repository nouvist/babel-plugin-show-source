import { NodePath, types } from '@babel/core';
import createInjectionStatement, { createInjectionObjectExpression } from './createInjectionStatement';

export default function createInjectionWrapper(
  path: NodePath<types.ArrowFunctionExpression | types.FunctionExpression>,
  funcCode: string | undefined,
  property: string,
  removeFunction?: boolean,
) {
  const id = types.identifier('f');
  if (removeFunction) {
    return createInjectionObjectExpression(funcCode, property);
  } else {
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
}
