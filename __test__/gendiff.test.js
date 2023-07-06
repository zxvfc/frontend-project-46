import { test, expect } from '@jest/globals'
import fs from 'fs';
import paths from 'path';
import genDiff from '../src/index.js';

const obj1 = {
  a: 'a'
};

const obj2 = {
  a: 'b'
};

const format = 's';
const fixturesFolder = '__fixtures__/';
const exp1 = fs.readFileSync(fixturesFolder + 'stylish-result1', 'utf8');

test('genDiff', () => {
  expect(genDiff(fixturesFolder + 'file1.json', fixturesFolder + 'file2.json', format)).toBe(exp1);
});
