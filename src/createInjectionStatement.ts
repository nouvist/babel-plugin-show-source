import { types } from '@babel/core';

const TO_STRING_EXCEPTION = `function() {
  throw new Error("\"show source\" directive is not processed correcty.");
}`;

export default function createInjectionStatement(
  funcId: string,
  funcCode?: string,
) {
  return types.expressionStatement(
    types.assignmentExpression(
      '=',
      types.memberExpression(
        types.identifier(funcId),
        types.identifier('toString'),
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
