import { PluginObj, types } from '@babel/core';
import createInjectionStatement from './createInjectionStatement';
import createInjectionWrapper from './createInjectionWrapper';
import { functionDeclarationToString } from './functionDeclarationToString';

interface Options {
  removeDirective: boolean;
}

export default function babelPluginShowSource(
  _options?: Partial<Options>,
): Partial<PluginObj> {
  const options: Options = {
    removeDirective: false,
    ..._options,
  };

  return {
    visitor: {
      Directive(path) {
        const isShowSource = path.node.value.value === 'show source';
        if (!isShowSource) return;
        if (options.removeDirective) path.remove();

        const func = path.parentPath.parentPath;
        if (func === null) return;

        const funcParent = func.parentPath;

        if (
          func.isFunctionDeclaration() &&
          funcParent !== null &&
          (funcParent.isBlockStatement() || funcParent.isProgram())
        ) {
          const funcCode = functionDeclarationToString(func.node);
          const injectionStatement = createInjectionStatement(
            func.node.id!.name,
            funcCode,
          );

          func.replaceWithMultiple([func.node, injectionStatement]);
        }
      },
    },
  };
}
