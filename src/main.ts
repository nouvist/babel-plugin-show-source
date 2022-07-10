import { PluginObj, types } from '@babel/core';
import createInjectionStatement from './createInjectionStatement';
import createInjectionWrapper from './createInjectionWrapper';
import { functionDeclarationToString } from './functionDeclarationToString';

interface Options {
  removeDirective: boolean;
  directive: string;
  property: string;
}

function babelPluginShowSource(
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
          const funcCode = functionDeclarationToString(func.node);
          const injectionStatement = createInjectionStatement(
            func.node.id!.name,
            funcCode,
            options.property,
          );

          // func.replaceWithMultiple([func.node, injectionStatement]);
          // replaceWithMultiple trigger maximum call stack
          // even with func.skip() method
          const idx = funcParent.node.body.indexOf(func.node);
          funcParent.node.body = [
            ...funcParent.node.body.slice(0, idx + 1),
            injectionStatement,
            ...funcParent.node.body.slice(idx + 1),
          ];
        } else if (func.isFunctionExpression()) {
          const newFunc = createInjectionWrapper(func, options.property);

          func.replaceWith(newFunc);
          func.skip();
        }
      },
    },
  };
}

export default babelPluginShowSource;
// Babel is still using CommonJS
module.exports = babelPluginShowSource;
