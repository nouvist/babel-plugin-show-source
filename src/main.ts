import { PluginObj } from '@babel/core';

export default function babelPluginShowSource(): Partial<PluginObj> {
  return {
    visitor: {
      Function(path) {
        console.log(path);
      },
    },
  };
}
