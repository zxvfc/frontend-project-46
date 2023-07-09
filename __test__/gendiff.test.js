import fs from 'fs';
import { fileURLToPath } from 'url';
import pathUtils from 'path';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathUtils.dirname(__filename);

const FIXTURES_FOLDER = pathUtils.resolve(__dirname, '..', '__fixtures__');

const buildFixturePath = (fixtureName) => pathUtils.resolve(FIXTURES_FOLDER, fixtureName);

const expectedStylish1 = fs.readFileSync(buildFixturePath('stylish-34'), 'utf8').trim();
const expectedStylish2 = fs.readFileSync(buildFixturePath('stylish-empty1'), 'utf8').trim();
const expectedPlain1 = fs.readFileSync(buildFixturePath('plain-34'), 'utf8').trim();
const expectedPlain2 = fs.readFileSync(buildFixturePath('plain-empty1'), 'utf8').trim();
const expectedJson1 = fs.readFileSync(buildFixturePath('json-34'), 'utf8').trim();
const expectedJson2 = fs.readFileSync(buildFixturePath('json-empty1'), 'utf8').trim();

const jsonFile1 = buildFixturePath('file1.json');

const jsonFile3 = buildFixturePath('file3.json');
const jsonFile4 = buildFixturePath('file4.json');

const yamlFile3 = buildFixturePath('file3.yaml');
const yamlFile4 = buildFixturePath('file4.yml');

const emptyFile = buildFixturePath('empty.json');

test('genDiff stylish', () => {
  const format = 'stylish';
  expect(genDiff(jsonFile3, jsonFile4, format)).toBe(expectedStylish1);
  expect(genDiff(yamlFile3, yamlFile4, format)).toBe(expectedStylish1);
  expect(genDiff(emptyFile, jsonFile1, format)).toBe(expectedStylish2);
});

test('genDiff plain', () => {
  const format = 'plain';
  expect(genDiff(jsonFile3, jsonFile4, format)).toBe(expectedPlain1);
  expect(genDiff(yamlFile3, yamlFile4, format)).toBe(expectedPlain1);
  expect(genDiff(emptyFile, jsonFile1, format)).toBe(expectedPlain2);
});

test('genDiff json', () => {
  const format = 'json';
  expect(genDiff(jsonFile3, jsonFile4, format)).toBe(expectedJson1);
  expect(genDiff(yamlFile3, yamlFile4, format)).toBe(expectedJson1);
  expect(genDiff(emptyFile, jsonFile1, format)).toBe(expectedJson2);
});
