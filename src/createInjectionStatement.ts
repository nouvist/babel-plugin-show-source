import { types } from '@babel/core';

const TO_STRING_EXCEPTION = `function() {
  return null;
}`;

export default function createInjectionStatement(
  funcId: string,
  funcCode: string | undefined,
  property: string,
) {
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
        types.blockStatement([
          types.returnStatement(
            types.stringLiteral(funcCode || TO_STRING_EXCEPTION),
          ),
        ]),
      ),
    ),
  );
}
