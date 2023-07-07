import process from 'process';
import fs from 'fs';
import pathUtils from 'path';
import _ from 'lodash';
import * as parser from './parser.js';
import * as nodeStatus from './node-status.js';
import * as formatter from './formatter.js';

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
    default: return 'unsuported file type';
  }
};

const readFileToJson = (path) => {
  const normalizedPath = normalizePath(path);
  const content = fs.readFileSync(normalizedPath, 'utf8');
  const contentType = defineContentType(normalizedPath);
  return parser.parseContent(content, contentType);
};

const defineFieldStatus = (key, obj1, obj2) => {
  if (!_.has(obj1, key)) return nodeStatus.ADDED;
  if (!_.has(obj2, key)) return nodeStatus.DELETED;
  if (obj1[key] !== obj2[key]) return nodeStatus.CHANGED;
  return nodeStatus.NOT_CHANGED;
};

const buildFieldDiff = (fieldName, oldValue, newValue, status) => ({
  fieldName, oldValue, newValue, status,
});

const buildDiff = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  return _.union(keys1, keys2).map((key) => {
    const status = defineFieldStatus(key, obj1, obj2);
    switch (key) {
      case nodeStatus.ADDED: return buildFieldDiff(key, null, obj2[key], status);
      case nodeStatus.DELETED: return buildFieldDiff(key, obj1[key], null, status);
      default: return buildFieldDiff(key, obj1[key], obj2[key], status);
    }
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
