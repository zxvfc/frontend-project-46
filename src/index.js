import process from 'process';
import fs from 'fs';
import pathUtils from 'path';
import _ from 'lodash';
import * as parser from './parser.js';
import * as nodeType from './node-type.js';
import * as formatter from './formatters/index.js';

const DEFAULT_FORMAT = formatter.STYLISH;

const isAbsolute = (path) => path.startsWith('/');

const normalizePath = (pathToFile) => pathUtils.resolve(isAbsolute(pathToFile) ? pathToFile : `${process.cwd()}/${pathToFile}`);

const getExtension = (path) => path.slice(path.lastIndexOf('.'));

const defineContentType = (path) => {
  const extenstion = getExtension(path);
  switch (extenstion) {
    case '.json': return parser.JSON_TYPE;
    case '.yml':
    case '.yaml': return parser.YAML_TYPE;
    default: throw new Error(`Unsuported file type: ${extenstion}`);
  }
};

const readFileToJson = (path) => {
  const normalizedPath = normalizePath(path);
  const content = fs.readFileSync(normalizedPath, 'utf8');
  const contentType = defineContentType(normalizedPath);
  return parser.parseContent(content, contentType);
};

const defineNodeType = (key, obj1, obj2) => {
  if (!_.has(obj1, key)) return nodeType.ADDED;
  if (!_.has(obj2, key)) return nodeType.DELETED;

  const value1 = obj1[key];
  const value2 = obj2[key];

  if (_.isObject(value1) && _.isObject(value2)) return nodeType.NESTED;
  if (value1 === value2) return nodeType.UNCHANGED;
  return nodeType.CHANGED;
};

const buildDiff = (obj1, obj2) => {
  const keys1 = _.keys(obj1);
  const keys2 = _.keys(obj2);
  return _.union(keys1, keys2).map((name) => {
    const value1 = obj1[name];
    const value2 = obj2[name];

    const type = defineNodeType(name, obj1, obj2);
    if (type === nodeType.NESTED) return { name, child: buildDiff(value1, value2), type };
    return {
      name, oldValue: value1, newValue: value2, type,
    };
  });
};

const handleFiles = (path1, path2) => {
  const obj1 = readFileToJson(path1);
  const obj2 = readFileToJson(path2);

  return buildDiff(obj1, obj2);
};

const genDiff = (path1, path2, format = DEFAULT_FORMAT) => {
  const diff = handleFiles(path1, path2);
  return formatter.formatDiff(diff, format);
};

export default genDiff;
export { DEFAULT_FORMAT };
