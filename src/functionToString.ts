import { NodePath, transformFromAstSync, types } from '@babel/core';
import generate from '@babel/generator';

export default function functionToString(path: NodePath) {
  return generate(path.node).code;
}
