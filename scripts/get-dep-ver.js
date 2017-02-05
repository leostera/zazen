#!/usr/bin/env node

const name = process.argv[2]
const pkg = require('../package.json')

console.log(pkg.devDependencies[name])
