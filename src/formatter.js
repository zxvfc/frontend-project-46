import _ from 'lodash';
import * as nodeStatus from './node-status.js';

const STYLISH = 'stylish';

const buildStylishField = (fieldName, value) => `${fieldName}: ${value}`;

const formatStylish = (diff) => {
  const formatNodeStylish = (node) => {
    const { fieldName } = node;
    switch (node.status) {
      case nodeStatus.ADDED: return [`+ ${buildStylishField(fieldName, node.newValue)}`];
      case nodeStatus.DELETED: return [`- ${buildStylishField(fieldName, node.oldValue)}`];
      case nodeStatus.CHANGED: return [`- ${buildStylishField(fieldName, node.oldValue)}`, `+ ${buildStylishField(fieldName, node.newValue)}`];
      case nodeStatus.NOT_CHANGED: return [`  ${buildStylishField(fieldName, node.oldValue)}`];
      default: return ['unsupported status'];
    }
  }
  return `{\n\t${_.sortBy(diff, ['fieldName']).flatMap(formatNodeStylish).join('\n\t')}\n}\n`;
};

const formatDiff = (diff, format) => {
  switch (format) {
    case STYLISH: return formatStylish(diff);
    default: return 'unsupported output format';
  }
};

export { formatDiff, STYLISH };
