#!/usr/bin/env node

import { program } from 'commander';
import genDiff from '../src/index.js';

program
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f --format <type>', 'output format')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .action((path1, path2, options) => {
    const formattedDiff = genDiff(path1, path2, options.format);
    console.log(formattedDiff);
  });

program.parse();
