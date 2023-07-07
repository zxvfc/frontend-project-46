import fs from 'fs';
import { fileURLToPath } from 'url';
import pathUtils from 'path';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathUtils.dirname(__filename);

const FIXTURES_FOLDER = pathUtils.resolve(__dirname, '..', '__fixtures__');
const format = 'stylish';

const buildFixturePath = (fixtureName) => pathUtils.resolve(FIXTURES_FOLDER, fixtureName);

const exp1 = fs.readFileSync(buildFixturePath('stylish-12'), 'utf8');
const exp2 = fs.readFileSync(buildFixturePath('stylish-34'), 'utf8');
const exp3 = fs.readFileSync(buildFixturePath('stylish-empty1'), 'utf8');

const jsonFile1 = buildFixturePath('file1.json');
const jsonFile2 = buildFixturePath('file2.json');

const jsonFile3 = buildFixturePath('file3.json');
const jsonFile4 = buildFixturePath('file4.json');

const yamlFile1 = buildFixturePath('file1.yaml');
const yamlFile2 = buildFixturePath('file2.yml');

const yamlFile3 = buildFixturePath('file3.yaml');
const yamlFile4 = buildFixturePath('file4.yml');

const emptyFile = buildFixturePath('empty.json');

test('genDiff', () => {
  expect(genDiff(jsonFile1, jsonFile2, format)).toBe(exp1);
  expect(genDiff(yamlFile1, yamlFile2, format)).toBe(exp1);
//  expect(genDiff(jsonFile3, jsonFile4, format)).toBe(exp2);
//  expect(genDiff(yamlFile3, yamlFile4, format)).toBe(exp2);
  expect(genDiff(emptyFile, jsonFile1, format)).toBe(exp3);
});
