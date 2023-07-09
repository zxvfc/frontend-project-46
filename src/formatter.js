import _ from 'lodash';
import * as nodeType from './node-type.js';

const STYLISH = 'stylish';
const replacer = ' ';
const spacesCount = 4;

const getIndent = (depth) => replacer.repeat(depth * spacesCount - 2);
const getBracketIndent = (depth) => replacer.repeat(depth * spacesCount - spacesCount);

const stringify = (data, depth) => {
  if (!_.isObject(data)) return `${data}`;

  const lines = _.entries(data).map(([key, value]) => `${getIndent(depth)}  ${key}: ${stringify(value, depth + 1)}`);
  return ['{', ...lines, `${getBracketIndent(depth)}}`].join('\n');
};

const formatStylish = (diff) => {
  const iter = (node, depth) => {
    const lines = _.sortBy(node, ['name']).map((data) => {
      const {
        name, type, oldValue, newValue, child,
      } = data;
      switch (type) {
        case nodeType.NESTED: return `${getIndent(depth)}  ${name}: ${iter(child, depth + 1)}`;
        case nodeType.ADDED: return `${getIndent(depth)}+ ${name}: ${stringify(newValue, depth + 1)}`;
        case nodeType.DELETED: return `${getIndent(depth)}- ${name}: ${stringify(oldValue, depth + 1)}`;
        case nodeType.UNCHANGED: return `${getIndent(depth)}  ${name}: ${stringify(oldValue, depth + 1)}`;
        case nodeType.CHANGED: return `${getIndent(depth)}- ${name}: ${stringify(oldValue, depth + 1)}\n${getIndent(depth)}+ ${name}: ${stringify(newValue, depth + 1)}`;
        default: throw new Error(`Unknown node of: ${type}`);
      }
    });
    return ['{', ...lines, `${getBracketIndent(depth)}}`].join('\n');
  };

  return `${iter(diff, 1)}\n`;
};

const formatDiff = (diff, format) => {
  switch (format) {
    case STYLISH: return formatStylish(diff);
    default: throw new Error(`Unknown output format type: '${format}'`);
  }
};

export { formatDiff, STYLISH };
