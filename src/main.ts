import { ConfigAPI, PluginObj } from '@babel/core';
import createInjectionStatement from './createInjectionStatement';
import createInjectionWrapper from './createInjectionWrapper';
import functionToString from './functionToString';

interface Options {
  removeDirective: boolean;
  directive: string;
  property: string;
}

function babelPluginShowSource(
  api: ConfigAPI,
  _options?: Partial<Options>,
): Partial<PluginObj> {
  const options: Options = {
    removeDirective: false,
    directive: 'show source',
    property: 'toString',
    ..._options,
  };

  return {
    visitor: {
      Directive(path) {
        const isShowSource = path.node.value.value === options.directive;
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
          const funcCode = functionToString(func);
          const injectionStatement = createInjectionStatement(
            func.node.id!.name,
            funcCode,
            options.property,
          );

          func.replaceWithMultiple([func.node, injectionStatement]);
          func.skip();
        } else if (
          func.isFunctionExpression() ||
          func.isArrowFunctionExpression()
        ) {
          const funcCode = functionToString(func);
          const newFunc = createInjectionWrapper(
            func,
            funcCode,
            options.property,
          );

          func.replaceWith(newFunc);
          func.skip();
        }
      },
    },
  };
}

export default babelPluginShowSource;
module.exports = babelPluginShowSource;
