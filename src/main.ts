import { PluginObj, transformFromAstSync, types } from '@babel/core';

export default function babelPluginShowSource(): Partial<PluginObj> {
  return {
    visitor: {
      Directive(path) {
        const isShowSource = path.node.value.value === 'show source';
        if (!isShowSource) return;

        const func = path.parentPath.parentPath;
        if (func === null || !func.isFunctionDeclaration()) return;

        const funcParent = func.parentPath;

        if (
          funcParent === null ||
          !(funcParent.isBlockStatement() || funcParent.isProgram())
        )
          return;

        if (!func.node.id?.name) console.warn('not implemented');

        const funcIndex = funcParent.node.body.indexOf(func.node);

        const funcCode = transformFromAstSync(
          types.program([func.node]),
          undefined,
          {
            filename: 'unknown.js',
          },
        )?.code;

        const definePropertyStatement = types.callExpression(
          types.memberExpression(
            types.identifier('Object'),
            types.identifier('defineProperty'),
          ),
          [
            types.identifier(func.node.id!.name),
            types.objectExpression([
              types.objectMethod(
                'method',
                types.identifier('toString'),
                [],
                types.blockStatement([
                  types.returnStatement(
                    types.stringLiteral(
                      funcCode ||
                        'function () { throw new Error("Function.prototype.toString() not generated correctly"); }',
                    ),
                  ),
                ]),
              ),
            ]),
          ],
        );

        const newBody: types.Statement[] = [
          ...funcParent.node.body.slice(0, funcIndex + 1),
          definePropertyStatement,
          ...funcParent.node.body.slice(funcIndex + 1),
        ];

        funcParent.node.body = newBody;
      },
    },
  };
}

function is() {}
