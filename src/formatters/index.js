import formatStylish from './stylish.js';
import formatPlain from './plain.js';
import formatJson from './json.js';

const STYLISH = 'stylish';
const PLAIN = 'plain';
const JSON = 'json';

const formatDiff = (diff, format) => {
  switch (format) {
    case STYLISH: return formatStylish(diff);
    case PLAIN: return formatPlain(diff);
    case JSON: return formatJson(diff);
    default: throw new Error(`Unknown output format type: '${format}'`);
  }
};

export {
  formatDiff, STYLISH, PLAIN, JSON,
};
