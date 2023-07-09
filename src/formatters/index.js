import formatStylish from './stylish.js';
import formatPlain from './plain.js';

const STYLISH = 'stylish';
const PLAIN = 'plain';

const formatDiff = (diff, format) => {
  switch (format) {
    case STYLISH: return formatStylish(diff);
    case PLAIN: return formatPlain(diff);
    default: throw new Error(`Unknown output format type: '${format}'`);
  }
};

export { formatDiff, STYLISH };
