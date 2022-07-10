import { types } from '@babel/core';

const TO_STRING_EXCEPTION = `function() {
  throw new Error("babel-plugin-show-source directive is not processed correcty.");
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
