import {
	atom
} from 'zazen/utils'

import {
	either,
	mirror,
	untag
} from 'zazen/either'

import {
	Suite
} from 'benchmark'

const id = x => x
const suite = new Suite('Either')

suite
  .add('either:left',  () => either(id,id, [atom('Left'),  1]))
  .add('either:right', () => either(id,id, [atom('Right'), 1]))
  .add('mirror:right', () => mirror([atom('Right'), 1]))
  .add('mirror:left',  () => mirror([atom('Right'), 1]))
  .add('untag:right',  () => untag([atom('Right'), 1]))
  .add('untag:left',   () => untag([atom('Right'), 1]))
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run()
