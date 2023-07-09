import _ from 'lodash';
import * as nodeType from '../node-type.js';

const stringify = (value) => {
  if (_.isObject(value)) return '[complex value]';
  if (_.isString(value)) return `'${value}'`;
  return `${value}`;
};

const buildPrefix = (path, name) => `Property '${[...path, name].join('.')}'`;

export default (diff) => {
  const iter = (path, node) => _.sortBy(node, ['name']).map(({
    name, type, oldValue, newValue, child,
  }) => {
    if (type === nodeType.NESTED) return iter([...path, name], child);

    switch (type) {
      case nodeType.ADDED: return `${buildPrefix(path, name)} was added with value: ${stringify(newValue)}`;
      case nodeType.DELETED: return `${buildPrefix(path, name)} was removed`;
      case nodeType.CHANGED: return `${buildPrefix(path, name)} was updated. From ${stringify(oldValue)} to ${stringify(newValue)}`;
      case nodeType.UNCHANGED: return '';
      default: throw new Error(`Unsupported node type: ${type}`);
    }
  })
    .filter((line) => !_.isEmpty(line))
    .join('\n');
  return iter([], diff);
};
