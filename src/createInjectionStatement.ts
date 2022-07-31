import { types } from '@babel/core';

const TO_STRING_EXCEPTION = `function() {
  return null;
}`;

export default function createInjectionStatement(
  funcId: string,
  funcCode: string | undefined,
  property: string,
  removeFunction?: boolean,
) {
  if (removeFunction) {
    return types.variableDeclaration('const', [
      types.variableDeclarator(
        types.identifier(funcId),
        createInjectionObjectExpression(funcCode, property),
      ),
    ]);
  } else {
    return types.expressionStatement(
      types.assignmentExpression(
        '=',
        types.memberExpression(
          types.identifier(funcId),
          types.identifier(property),
        ),
        types.functionExpression(
          undefined,
          [],
          createInjectionBlockStatement(funcCode),
        ),
      ),
    );
  }
}

export function createInjectionBlockStatement(funcCode?: string) {
  return types.blockStatement([
    types.returnStatement(types.stringLiteral(funcCode || TO_STRING_EXCEPTION)),
  ]);
}

export function createInjectionObjectExpression(
  funcCode: string | undefined,
  property: string,
) {
  return types.objectExpression([
    types.objectMethod(
      'method',
      types.identifier(property),
      [],
      createInjectionBlockStatement(funcCode),
    ),
  ]);
}
