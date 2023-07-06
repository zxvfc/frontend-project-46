import yaml from 'js-yaml';

const JSON_TYPE = 'json';
const YAML_TYPE = 'yaml';

const parseContent = (content, contentType) => {
  switch (contentType) {
    case JSON_TYPE: return JSON.parse(content);
    case YAML_TYPE: return yaml.load(content);
    default: return { message: 'error' };
  }
};

export { parseContent, JSON_TYPE, YAML_TYPE };
