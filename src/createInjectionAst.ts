import { types } from '@babel/core';

export function createInjectionStatement(funcId: string, funcCode?: string) {
  return types.expressionStatement(
    types.callExpression(
      types.memberExpression(
        types.identifier('Object'),
        types.identifier('defineProperty')
      ),
      [
        types.identifier(funcId),
        types.objectExpression([
          types.objectMethod(
            'method',
            types.identifier('toString'),
            [],
            types.blockStatement([
              types.returnStatement(
                types.stringLiteral(
                  funcCode ||
                  `function ${funcId}() {
  throw new Error("Function.prototype.toString() not generated correctly");
}`
                )
              ),
            ])
          ),
        ]),
      ]
    )
  );
}
