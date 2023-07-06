import fs from 'fs';
import { fileURLToPath } from 'url';
import pathUtils from 'path';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathUtils.dirname(__filename);

const FIXTURES_FOLDER = pathUtils.resolve(__dirname, '..', '__fixtures__');
const format = 's';

const buildFixturePath = (fixtureName) => pathUtils.resolve(FIXTURES_FOLDER, fixtureName);

const jsonFile1 = buildFixturePath('file1.json');
const jsonFile2 = buildFixturePath('file2.json');
const exp1 = fs.readFileSync(buildFixturePath('stylish-result1'), 'utf8');

const yamlFile1 = buildFixturePath('file1.yaml');
const yamlFile2 = buildFixturePath('file2.yaml');

test('genDiff', () => {
  expect(genDiff(jsonFile1, jsonFile2, format)).toBe(exp1);
  expect(genDiff(yamlFile1, yamlFile2, format)).toBe(exp1);
});
