#!/usr/bin/env node

const process = require('process')
const fs = require('fs')
const paths = require('path')
const _ = require('lodash')
const { program } = require('commander')

const ADDED = 'added'
const DELETED = 'deleted'
const CHANGED = 'changed'
const NOT_CHANGED = 'not changed'

const isAbsolute = (path) => path.startsWith('/')

const normalizePath = (pathToFile) => paths.resolve(isAbsolute(pathToFile) ? pathToFile : `${process.cwd()}/${pathToFile}`)

const readFile = (path) => fs.readFileSync(path, 'utf8')

const parseContent = (content) => JSON.parse(content)

const defineFieldStatus = (key, obj1, obj2) => {
  if (!_.has(obj1, key)) return ADDED
  if (!_.has(obj2, key)) return DELETED
  if (obj1[key] !== obj2[key]) return CHANGED
  return NOT_CHANGED
}

const buildFieldDiff = (fieldName, oldValue, newValue, status) => ({
  fieldName, oldValue, newValue, status,
})

const buildDiff = (obj1, obj2) => {
  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)
  return _.union(keys1, keys2).map((key) => {
    const status = defineFieldStatus(key, obj1, obj2)
    switch (key) {
      case ADDED: return buildFieldDiff(key, null, obj2[key], status)
      case DELETED: return buildFieldDiff(key, obj1[key], null, status)
      default: return buildFieldDiff(key, obj1[key], obj2[key], status)
    }
  })
}

const buildField = (fieldName, value) => `${fieldName}: ${value}`

const formatNode = (node) => {
  const { fieldName } = node
  switch (node.status) {
    case ADDED: return [`+ ${buildField(fieldName, node.newValue)}`]
    case DELETED: return [`- ${buildField(fieldName, node.oldValue)}`]
    case CHANGED: return [`- ${buildField(fieldName, node.oldValue)}`, `+ ${buildField(fieldName, node.newValue)}`]
    case NOT_CHANGED: return [`  ${buildField(fieldName, node.oldValue)}`]
    default: return ['error']
  }
}

const formatDiff = (diff, format) => `{\n\t${_.sortBy(diff, ['fieldName']).flatMap(formatNode).join('\n\t')}\n}`

const handleFiles = (path1, path2) => {
  const normalizedPath1 = normalizePath(path1)
  const fileContent1 = readFile(normalizedPath1)
  const obj1 = parseContent(fileContent1)

  const normalizedPath2 = normalizePath(path2)
  const fileContent2 = readFile(normalizedPath2)
  const obj2 = parseContent(fileContent2)

  return buildDiff(obj1, obj2)
}

program
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f --format <type>', 'output format')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .action((path1, path2, options) => {
    const diff = handleFiles(path1, path2)
    const formattedDiff = formatDiff(diff, options.format)
    console.log(formattedDiff)
  })
program.parse()

