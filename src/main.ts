import { PluginObj, types } from '@babel/core';
import createInjectionStatement from './createInjectionStatement';
import { functionDeclarationToString } from './functionDeclarationToString';

interface Options {
  removeDirective?: boolean;
}

export default function babelPluginShowSource(
  options?: Options,
): Partial<PluginObj> {
  return {
    visitor: {
      Directive(path) {
        const isShowSource = path.node.value.value === 'show source';
        if (!isShowSource) return;

        const func = path.parentPath.parentPath;
        if (options.removeDirective) path.remove();

        if (func === null || !func.isFunctionDeclaration()) return true;

        const funcParent = func.parentPath;

        if (
          funcParent === null ||
          !(funcParent.isBlockStatement() || funcParent.isProgram())
        )
          return true;

        if (!func.node.id?.name) console.warn('not implemented');

        const funcIndex = funcParent.node.body.indexOf(func.node);

        const funcCode = functionDeclarationToString(func.node);
        const injectionStatement = createInjectionStatement(
          func.node.id!.name,
          funcCode,
        );

        const newBody: types.Statement[] = [
          ...funcParent.node.body.slice(0, funcIndex + 1),
          injectionStatement,
          ...funcParent.node.body.slice(funcIndex + 1),
        ];

        funcParent.node.body = newBody;
      },
    },
  };
}
